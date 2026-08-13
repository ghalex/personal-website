import { Pill, Section } from "@/components/common";
import type { PublishedPost } from "@/types";

type PostHeaderProps = {
  post: PublishedPost;
};

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <Section>
      <div className="flex flex-col gap-3 px-6 pt-10 pb-8">
        <h1 className="text-[30px] leading-[1.25] font-semibold tracking-[-0.02em] text-pretty">
          {post.title}
        </h1>
        <p className="text-[15.5px] leading-[1.6] text-muted-foreground text-pretty">
          {post.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </div>
    </Section>
  );
}
