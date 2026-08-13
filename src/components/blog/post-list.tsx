import Link from "next/link";

import { Pill, Section } from "@/components/common";
import { isPublished, posts } from "@/lib/posts";
import { formatPostDate } from "@/lib/utils";
import type { BlogPost, PublishedPost } from "@/types";

function PublishedCard({ post }: { post: PublishedPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col gap-2.5 px-6 py-[26px] transition-colors hover:bg-card"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-xs text-muted-foreground">
        <span>{formatPostDate(post.date)}</span>
        <span>{post.readingTime} min read</span>
      </div>
      <span className="text-[19px] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty">
        {post.title}
      </span>
      <span className="text-sm leading-[1.6] text-muted-foreground text-pretty">
        {post.description}
      </span>
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
        {post.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
        <span className="ml-auto font-mono text-xs text-primary">Read →</span>
      </div>
    </Link>
  );
}

function DraftCard({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-col gap-2.5 px-6 py-[26px]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">draft</span>
        <Pill>coming soon</Pill>
      </div>
      <span className="text-[19px] leading-[1.35] font-semibold tracking-[-0.01em] text-pretty text-muted-foreground">
        {post.title}
      </span>
      {post.description && (
        <span className="text-sm leading-[1.6] text-muted-foreground text-pretty">
          {post.description}
        </span>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {post.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      )}
    </div>
  );
}

export function PostList() {
  return (
    <Section>
      <div className="divide-y divide-border">
        {posts.map((post) =>
          isPublished(post) ? (
            <PublishedCard key={post.slug} post={post} />
          ) : (
            <DraftCard key={post.slug} post={post} />
          ),
        )}
      </div>
    </Section>
  );
}
