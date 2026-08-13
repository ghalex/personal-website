import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { BlogPost, PublishedPost } from "@/types";

const postsDir = path.join(process.cwd(), "content", "blog");

function readPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(postsDir, fileName), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    readingTime: data.readingTime,
    tags: data.tags,
    content: content.trim() || undefined,
  };
}

/** Published posts newest first, then drafts (no date) by slug. */
export const posts: BlogPost[] = fs
  .readdirSync(postsDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .map(readPost)
  .sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date !== b.date) return a.date ? -1 : 1;
    return a.slug.localeCompare(b.slug);
  });

export function isPublished(post: BlogPost): post is PublishedPost {
  return Boolean(post.date && post.content);
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
