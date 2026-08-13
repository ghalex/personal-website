import Link from "next/link";

import { Section } from "@/components/common";
import { isPublished } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

type PostNavProps = {
  previous?: BlogPost;
  next?: BlogPost;
};

export function PostNav({ previous, next }: PostNavProps) {
  const hrefFor = (post?: BlogPost) =>
    post && isPublished(post) ? `/blog/${post.slug}` : "/#blog";

  const renderCell = (label: string, post?: BlogPost, alignEnd = false) => (
    <Link
      href={hrefFor(post)}
      className={cn(
        "flex flex-col gap-[5px] px-6 py-[18px] transition-colors hover:bg-card",
        alignEnd ? "items-end text-right" : "border-r border-border",
      )}
    >
      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground">
        {label}
      </span>
      <span className="text-[13.5px] font-medium">{post?.title ?? "All posts"}</span>
    </Link>
  );

  return (
    <Section>
      <div className="grid grid-cols-2">
        {renderCell("← Previous", previous)}
        {renderCell("Next →", next, true)}
      </div>
    </Section>
  );
}
