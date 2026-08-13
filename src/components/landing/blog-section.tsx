import Link from "next/link";

import { Section, SectionLabel } from "@/components/common";
import { posts } from "@/lib/content";

export function BlogSection() {
  return (
    <Section id="blog">
      <div className="p-6 pb-[18px]">
        <SectionLabel>Blog</SectionLabel>
      </div>
      {posts.map((post) => (
        <Link
          key={post.title}
          href={post.href}
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
              {post.date}
            </span>
          </div>
        </Link>
      ))}
    </Section>
  );
}
