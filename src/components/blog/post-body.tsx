import { Section } from "@/components/common";
import type { PostBlock, PostInline, PublishedPost } from "@/types";

type PostBodyProps = {
  post: PublishedPost;
};

export function PostBody({ post }: PostBodyProps) {
  const renderInline = (content: PostInline[]) =>
    content.map((part, index) => {
      if (typeof part === "string") return part;
      if ("href" in part)
        return (
          <a key={index} href={part.href} className="link">
            {part.text}
          </a>
        );
      if ("em" in part) return <em key={index}>{part.text}</em>;
      return <strong key={index}>{part.text}</strong>;
    });

  const renderSteps = (items: PostInline[][]) => (
    <div className="flex flex-col gap-2 text-[13.5px]">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2.5">
          <span className="shrink-0 font-mono text-xs leading-[1.9] text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{renderInline(item)}</span>
        </div>
      ))}
    </div>
  );

  const renderBlock = (block: PostBlock, index: number) => {
    if (block.type === "h2")
      return (
        <h2 key={index} className="mt-3.5 -mb-1.5 text-xl font-semibold tracking-[-0.01em]">
          {block.text}
        </h2>
      );
    if (block.type === "steps") return <div key={index}>{renderSteps(block.items)}</div>;
    return <p key={index}>{renderInline(block.content)}</p>;
  };

  return (
    <Section>
      <article className="flex flex-col gap-[18px] px-6 pt-8 pb-10 text-[15px] leading-[1.75] text-pretty">
        {post.body.map(renderBlock)}
      </article>
    </Section>
  );
}
