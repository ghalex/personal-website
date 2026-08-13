import { Pill, Section, SectionLabel } from "@/components/common";
import { stack } from "@/lib/content";

export function StackSection() {
  return (
    <Section id="stack" className="p-6">
      <SectionLabel className="mb-1">Stack</SectionLabel>
      {stack.map((group) => (
        <div
          key={group.num}
          className="grid grid-cols-1 items-start gap-3 border-b border-border py-3.5 sm:grid-cols-[150px_1fr]"
        >
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">{group.num}</span> {group.name}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <Pill key={item} variant="item">
                {item}
              </Pill>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}
