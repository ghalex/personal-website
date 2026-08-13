import { Section, SectionLabel } from "@/components/common";
import { site } from "@/lib/content";

export function AboutSection() {
  return (
    <Section className="p-6">
      <SectionLabel className="mb-3.5">About</SectionLabel>
      <div className="flex flex-col gap-2.5 text-[14.5px] leading-[1.65] text-pretty">
        <p>
          I&apos;m a builder at heart. After 20 years in software I keep coming back to
          the same thing: taking an idea from zero to a working product with my own
          hands — the storage engine, the UI, the go-to-market, all of it.
        </p>
        <p>
          Right now that means{" "}
          <a href={site.logzai} className="link">
            LogzAI
          </a>
          , an AI-native log observability platform I built solo on a hand-built Delta
          Lake storage engine (one of 3 winners at the inVest accelerator Demo Day), and{" "}
          <a href={site.zenve3d} className="link">
            Zenve3d
          </a>
          , my newest venture. Before these I co-founded Zapant, a trading platform that
          executed 300K+ live transactions, bootstrapped from AntSignals — a
          trading-journal SaaS I grew to ~€2K/month with zero ad spend.
        </p>
        <p>
          I like hard technical problems (I once wrote an OS from scratch), small teams,
          and products that make money without permission.
        </p>
      </div>
    </Section>
  );
}
