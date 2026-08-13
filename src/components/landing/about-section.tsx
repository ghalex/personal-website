import { RichText, Section, SectionLabel } from "@/components/common";
import { about } from "@/lib/content";

export function AboutSection() {
  return (
    <Section className="p-6">
      <SectionLabel className="mb-3.5">About</SectionLabel>
      <div className="flex flex-col gap-2.5 text-[14.5px] leading-[1.65] text-pretty">
        {about.map((paragraph) => (
          <p key={paragraph}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>
    </Section>
  );
}
