import ReactMarkdown, { type Components } from "react-markdown";

import { Section } from "@/components/common";
import type { PublishedPost } from "@/types";

type PostBodyProps = {
  post: PublishedPost;
};

/* react-markdown passes its AST `node` to custom components; strip it before spreading onto DOM elements */
function strip<P extends { node?: unknown }>(props: P) {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

const components: Components = {
  h2: (props) => (
    <h2 className="mt-3.5 -mb-1.5 text-xl font-semibold tracking-[-0.01em]" {...strip(props)} />
  ),
  h3: (props) => <h3 className="mt-2 -mb-1.5 text-base font-semibold" {...strip(props)} />,
  a: (props) => <a className="link" {...strip(props)} />,
  ol: (props) => (
    <ol
      className="flex flex-col gap-2 text-[13.5px] [counter-reset:steps] [&>li]:flex [&>li]:gap-2.5 [&>li]:[counter-increment:steps] [&>li]:before:shrink-0 [&>li]:before:font-mono [&>li]:before:text-xs [&>li]:before:leading-[1.9] [&>li]:before:text-primary [&>li]:before:content-[counter(steps,decimal-leading-zero)]"
      {...strip(props)}
    />
  ),
  ul: (props) => (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-[13.5px]" {...strip(props)} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-2 border-primary pl-4 text-muted-foreground" {...strip(props)} />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-[13px] leading-[1.7] [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0"
      {...strip(props)}
    />
  ),
  code: (props) => (
    <code
      className="rounded border border-border bg-card px-1 py-px font-mono text-[13px]"
      {...strip(props)}
    />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="w-full rounded-md border border-border" alt="" {...strip(props)} />
  ),
};

export function PostBody({ post }: PostBodyProps) {
  return (
    <Section>
      <article className="flex flex-col gap-[18px] px-6 pt-8 pb-10 text-[15px] leading-[1.75] text-pretty">
        <ReactMarkdown components={components}>{post.content}</ReactMarkdown>
      </article>
    </Section>
  );
}
