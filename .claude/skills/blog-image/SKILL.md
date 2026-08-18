---
name: blog-image
description: Generate AI cover art for a blog post — read the post, craft an on-brand image prompt, call gpt-image via scripts/generate-blog-image.mjs, store it next to the post's other assets. Use when asked to generate a blog image, cover art, or post illustration.
---

# Generate blog cover art

Produces one cover image per post — by default `public/blog/<slug>/cover.webp`,
generated from a prompt you write after reading the post.

Requires `OPENAI_API_KEY` in the environment, `.env.local` or `.env`. If the
script reports it missing, stop and ask the user to add it.

## Setup in a new repo

The bundled `scripts/generate-blog-image.mjs` is self-contained (Node 18+, no
dependencies — plain `fetch` against the OpenAI images API). Copy it to
`scripts/generate-blog-image.mjs` in the target repo and run it from the repo
root; every path resolves against `process.cwd()`.

Defaults assume a Next.js-style layout:

| Thing | Default | Flag |
|---|---|---|
| Posts | `content/blog/<slug>.md` | `--content-dir`, `--ext` |
| Images | `public/blog/<slug>/cover.webp` | `--out-dir`, `--out` |

Before the first run in an unfamiliar repo, confirm how the site resolves cover
images — some setups auto-detect the file on disk, others need a frontmatter
field pointing at it. Check that before assuming no frontmatter edit is needed.

## Steps

1. **Resolve the slug.** It's the post filename without the extension. If the
   argument is fuzzy ("the kernel post"), match it against the files.
2. **Read the post** — title, description, and enough of the body to identify
   the one core concept the cover should embody. Also read the `cover:`
   frontmatter field if there is one: it often describes intended art
   ("diagram — kernel architecture") and is a strong hint.
3. **Write the prompt** following the art direction below. One single scene,
   one idea — never a collage.
4. **Generate.** Long prompts go through a file to avoid shell quoting: write
   the prompt to the scratchpad, then:

   ```sh
   node scripts/generate-blog-image.mjs --slug <slug> --prompt-file <path>
   ```

   Re-running overwrites the existing cover — fine for regeneration, but
   confirm first if the user didn't ask for a replacement.
5. **Check the result.** Read the generated image file to view it. If it
   contains text/letters, UI chrome, or drifts off-palette, tighten the prompt
   and regenerate once before reporting.
6. **Fix the alt text.** If the post has a `cover:` field rendered as `alt`,
   make it describe the actual image, e.g.
   `cover: "Matte grey extruded solid with blue sketch wireframe overlay"`.
7. **Hand over.** Report the file path and size. The script also prints the
   served URL path when `--out-dir` sits under `public/` (Next.js-style static
   root); for any other layout, work the URL out by stripping that framework's
   static root. Suggest the dev server + the post URL to view; the user does
   their own browser verification.

## Art direction

The default direction below is Zenve3D's (CAD / Apple-style product
minimalism). In another project, swap the subject vocabulary and palette for
that project's brand, and keep the structure: fixed ingredients + a
post-specific subject, so covers read as one family rather than one-offs.

**ghalex.dev house rule (decided 2026-08-18): every cover uses the near-white
background below — never a colored or gradient background.** A blue-gradient
variant was tried and rejected; the light style is the family. Also: always
back up the existing cover to the scratchpad before regenerating over it.

- **Subject**: an abstract 3D still-life embodying the post's core concept
  using CAD vocabulary — extruded solids, filleted edges, boolean cuts, sketch
  outlines, wireframe overlays, construction/dimension lines, grids of repeated
  features. Metaphor over literalism; never render app UI, screenshots,
  devices, hands, or people.
- **Palette**: near-white background (#f5f6f9), matte light-grey solids, dark
  charcoal (#1c1c1e) accents, and exactly one blue accent (#007aff) used
  sparingly — an edge highlight, a sketch line, one face.
- **Composition**: single centered subject, generous negative space,
  three-quarter isometric view, landscape 3:2 framing.
- **Rendering**: clean minimal 3D product render, matte materials, soft even
  studio lighting, subtle contact shadows, no noise or grain — Apple-style
  product-photography minimalism.
- **Always end the prompt with**: "No text, no letters, no numbers, no logos,
  no watermark, no UI elements."

Example prompt shape (kernel-architecture post):

> Minimal 3D product render: a precise matte light-grey mechanical solid with
> filleted edges floating above a near-white (#f5f6f9) studio background, its
> lower half dissolving into a blue (#007aff) wireframe B-rep of the same
> shape — faces and edges shown as thin construction lines. Single centered
> subject, three-quarter isometric view, generous negative space, soft even
> studio lighting, subtle contact shadow, Apple-style minimalism. No text, no
> letters, no numbers, no logos, no watermark, no UI elements.

## Script options

| Flag | Default | Notes |
|---|---|---|
| `--slug` | — | required; must match a post file |
| `--prompt` / `--prompt-file` | — | one is required |
| `--out` | `cover.webp` | `.png` switches `output_format` to png |
| `--quality` | `high` | `low` \| `medium` \| `high` \| `auto`; low is fine for drafts |
| `--size` | `1536x1024` | or `1024x1024`, `1024x1536` |
| `--content-dir` | `content/blog` | where posts live |
| `--out-dir` | `public/blog` | image parent dir; image lands in `<out-dir>/<slug>/` |
| `--ext` | `.md` | post extension (`.mdx` etc.) |

Model is `gpt-image-1`.

## Origin

First built in `zenve3d-website` (Next.js 16 blog, `content/blog/*.md` →
`public/blog/<slug>/cover.webp`, auto-detected by `src/lib/posts.ts`). This
brain copy is the portable version: same defaults, plus the `--content-dir` /
`--out-dir` / `--ext` flags, and the served-URL line in the output is printed
only for a `public/`-rooted output dir. The repo copy does not have those flags
— the two are not in sync.
