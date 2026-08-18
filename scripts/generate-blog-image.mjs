#!/usr/bin/env node
/*
 * Generate AI cover art for a blog post and store it under <out-dir>/<slug>/.
 *
 * Usage:
 *   node scripts/generate-blog-image.mjs --slug <slug> --prompt "<prompt>"
 *   node scripts/generate-blog-image.mjs --slug <slug> --prompt-file <path>
 *
 * Options:
 *   --slug         Post slug — must match a file in the content dir (required)
 *   --prompt       Image prompt, inline (this or --prompt-file is required)
 *   --prompt-file  Read the prompt from a file instead (avoids shell quoting)
 *   --out          Output filename, default cover.webp
 *   --size         gpt-image size, default 1536x1024 (landscape)
 *   --quality      low | medium | high | auto, default high
 *   --content-dir  Where posts live, default content/blog
 *   --out-dir      Where images go, default public/blog
 *   --ext          Post extension to look for, default .md
 *
 * Requires OPENAI_API_KEY in the environment, .env.local or .env.
 * Run from the repo root — all paths resolve against process.cwd().
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) fail(`unexpected argument: ${key}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      fail(`missing value for ${key}`);
    }
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

/* Minimal .env parser — the script runs outside the framework that normally loads these. */
function loadEnvKey(name) {
  if (process.env[name]) return process.env[name];
  for (const file of [".env.local", ".env"]) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, "utf-8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match?.[1] === name) {
        return match[2].replace(/^["']|["']$/g, "");
      }
    }
  }
  return undefined;
}

const args = parseArgs(process.argv.slice(2));

const contentDir = args["content-dir"] ?? path.join("content", "blog");
const outDirBase = args["out-dir"] ?? path.join("public", "blog");
const ext = args.ext ?? ".md";

const slug = args.slug ?? fail("--slug is required");
const postPath = path.join(root, contentDir, `${slug}${ext}`);
if (!fs.existsSync(postPath)) {
  fail(`no post found at ${path.join(contentDir, slug + ext)}`);
}

let prompt = args.prompt;
if (!prompt && args["prompt-file"]) {
  prompt = fs.readFileSync(args["prompt-file"], "utf-8").trim();
}
if (!prompt) fail("--prompt or --prompt-file is required");

const out = args.out ?? "cover.webp";
const size = args.size ?? "1536x1024";
const quality = args.quality ?? "high";

const apiKey = loadEnvKey("OPENAI_API_KEY");
if (!apiKey) fail("OPENAI_API_KEY not set (env, .env.local or .env)");

console.log(`Generating ${size} ${quality}-quality image for "${slug}"…`);

const response = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size,
    quality,
    output_format: out.endsWith(".png") ? "png" : "webp",
  }),
});

if (!response.ok) {
  const body = await response.text();
  fail(`OpenAI API ${response.status}: ${body}`);
}

const payload = await response.json();
const b64 = payload.data?.[0]?.b64_json;
if (!b64) fail(`no image in response: ${JSON.stringify(payload).slice(0, 400)}`);

const outDir = path.join(root, outDirBase, slug);
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, out);
fs.writeFileSync(outPath, Buffer.from(b64, "base64"));

const kb = Math.round(fs.statSync(outPath).size / 1024);
const rel = path.join(outDirBase, slug, out);
/* Only a `public/`-rooted output dir maps predictably to a served URL. */
const served =
  outDirBase.split(path.sep)[0] === "public"
    ? ` — served at /${path.relative("public", rel).split(path.sep).join("/")}`
    : "";
console.log(`Saved ${rel} (${kb} KB)${served}`);
