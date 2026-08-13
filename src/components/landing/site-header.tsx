import Link from "next/link";

import { Container, ThemeToggle } from "@/components/common";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-sm">
      <Container className="flex h-[52px] items-center justify-between px-6">
        <Link href="#top" className="font-mono text-sm font-medium">
          ghalex<span className="text-primary">.dev</span>
        </Link>
        <nav className="flex items-center gap-[18px] text-[13px]">
          <Link
            href="#projects"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Projects
          </Link>
          <Link
            href="#stack"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Stack
          </Link>
          <Link
            href="#blog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
