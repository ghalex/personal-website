import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostBody, PostHeader, PostMetaBar, PostNav } from "@/components/blog";
import { BackToTop, StripeBand } from "@/components/common";
import { SiteFooter, SiteHeader } from "@/components/landing";
import { getPost, isPublished, posts } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.filter(isPublished).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || !isPublished(post)) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || !isPublished(post)) notFound();
  const index = posts.indexOf(post);
  const previous = index > 0 ? posts[index - 1] : undefined;
  const next = posts[index + 1];

  return (
    <>
      <SiteHeader activeNav="blog" />
      <main id="top">
        <StripeBand solid={false} />
        <PostMetaBar post={post} />
        <PostHeader post={post} />
        <StripeBand solid={false} className="h-14" />
        <PostBody post={post} />
        <PostNav previous={previous} next={next} />
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
