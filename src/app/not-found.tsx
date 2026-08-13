import Link from "next/link";

import { Section, StripeBand } from "@/components/common";
import { SiteFooter, SiteHeader } from "@/components/landing";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <StripeBand />
        <Section>
          <div className="flex flex-col gap-3 px-6 py-16">
            <span className="font-mono text-xs font-medium tracking-[0.08em] uppercase text-muted-foreground">
              404 <span className="text-border">{"//"}</span> not found
            </span>
            <h1 className="text-3xl font-semibold tracking-[-0.02em]">
              This page doesn&apos;t exist.
            </h1>
            <Link href="/#top" className="link w-fit text-[14.5px]">
              Back to ghalex.dev
            </Link>
          </div>
        </Section>
        <StripeBand solid={false} />
        <SiteFooter />
      </main>
    </>
  );
}
