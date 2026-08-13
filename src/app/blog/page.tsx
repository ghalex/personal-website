import type { Metadata } from "next";

import { PostList } from "@/components/blog";
import { BackToTop, Section, StripeBand } from "@/components/common";
import { SiteFooter, SiteHeader } from "@/components/landing";
import { isPublished, posts } from "@/lib/posts";

export const dynamic = "force-static";

const description = "Notes on storage engines, bootstrapping, and building things solo.";

export const metadata: Metadata = {
  title: "Blog",
  description,
};

export default function BlogIndexPage() {
  const year = posts.find(isPublished)?.date.slice(0, 4);

  return (
    <>
      <SiteHeader activeNav="blog" />
      <main id="top">
        <StripeBand solid={false} />
        <Section>
          <div className="flex flex-col gap-2.5 px-6 pt-10 pb-8">
            <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
              <span className="text-primary">$</span> ls ./posts
            </span>
            <h1 className="text-[30px] leading-[1.25] font-semibold tracking-[-0.02em]">
              Blog
            </h1>
            <p className="text-[15px] leading-[1.6] text-muted-foreground text-pretty">
              {description}
            </p>
          </div>
        </Section>
        <Section>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 font-mono text-xs text-muted-foreground">
            <span>
              {posts.length} posts
              {year && (
                <>
                  {" "}
                  <span className="text-border">{"//"}</span> {year}
                </>
              )}
            </span>
            <span>sorted by date ↓</span>
          </div>
        </Section>
        <PostList />
        <StripeBand solid={false} />
        <SiteFooter />
        <StripeBand bordered={false}>
          <div className="flex h-full items-center justify-end px-6">
            <BackToTop />
          </div>
        </StripeBand>
      </main>
    </>
  );
}
