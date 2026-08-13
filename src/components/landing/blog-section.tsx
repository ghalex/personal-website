import Link from "next/link";

import { Section, SectionLabel } from "@/components/common";
import { isPublished, posts } from "@/lib/content";
import { formatPostDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogSection() {
  const renderMeta = (post: BlogPost) => {
    if (!isPublished(post)) return "draft — coming soon";
    return (
      <>
        {formatPostDate(post.date)} <span className="text-border">{"//"}</span>{" "}
        {post.readingTime} min read
      </>
    );
  };

  return (
    <Section id="blog">
      <div className="p-6 pb-[18px]">
        <SectionLabel>Blog</SectionLabel>
      </div>
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={isPublished(post) ? `/blog/${post.slug}` : "#blog"}
          className="grid grid-cols-[120px_1fr] items-center gap-[18px] border-t border-border px-6 py-[18px] transition-colors hover:bg-card"
        >
          <div className="flex h-[68px] items-center justify-center rounded-md border border-border bg-stripes">
            <span className="font-mono text-[10px] text-muted-foreground">cover</span>
          </div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[14.5px] leading-[1.4] font-semibold text-pretty">
              {post.title}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {renderMeta(post)}
            </span>
          </div>
        </Link>
      ))}
    </Section>
  );
}
