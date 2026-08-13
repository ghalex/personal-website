import { Section } from "@/components/common";
import { HeroFigure } from "@/components/landing/hero-figure";
import { site } from "@/lib/content";

export function Hero() {
  return (
    <Section className="grid grid-cols-1 sm:grid-cols-[1fr_236px]">
      <div className="flex min-w-0 flex-col justify-center gap-2.5 px-6 pt-10 pb-[34px]">
        <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
          <span className="text-primary">$</span> whoami
        </span>
        <h1 className="text-3xl font-semibold tracking-[-0.02em]">{site.name}</h1>
        <p className="text-[15px] text-pretty text-muted-foreground">{site.tagline}</p>
      </div>
      <div className="relative min-h-[196px] overflow-hidden border-t border-border [background:repeating-linear-gradient(-45deg,var(--stripe)_0_1px,transparent_1px_10px)] sm:border-t-0 sm:border-l">
        <HeroFigure />
      </div>
    </Section>
  );
}
