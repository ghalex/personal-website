import { Section } from "@/components/common";
import { site } from "@/lib/content";

export function Hero() {
  return (
    <Section className="flex flex-col gap-2 px-6 pt-9 pb-[30px]">
      <h1 className="text-3xl font-semibold tracking-[-0.02em]">{site.name}</h1>
      <p className="text-[15px] text-pretty text-muted-foreground">{site.tagline}</p>
    </Section>
  );
}
