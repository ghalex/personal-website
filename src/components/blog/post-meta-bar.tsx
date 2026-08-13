import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/common";
import { formatPostDate } from "@/lib/utils";
import type { PublishedPost } from "@/types";

type PostMetaBarProps = {
  post: PublishedPost;
};

export function PostMetaBar({ post }: PostMetaBarProps) {
  return (
    <Section>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link
          href="/#blog"
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={13} strokeWidth={2} aria-hidden />
          Blog
        </Link>
        <span className="font-mono text-xs text-muted-foreground">
          {formatPostDate(post.date)} <span className="text-border">{"//"}</span>{" "}
          {post.readingTime} min read
        </span>
      </div>
    </Section>
  );
}
