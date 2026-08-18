import type { Metadata } from "next";

import { BackToTop, StripeBand } from "@/components/common";
import {
  AboutSection,
  BlogSection,
  Hero,
  ProjectsSection,
  QuickFacts,
  SiteFooter,
  SiteHeader,
  SocialLinks,
  StackSection,
} from "@/components/landing";
import { site } from "@/lib/content";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <StripeBand solid={false} />
        <Hero />
        <QuickFacts />
        <SocialLinks />
        <AboutSection />
        <BlogSection />
        <ProjectsSection />
        <StackSection />
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
