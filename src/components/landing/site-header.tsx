import Link from "next/link";

import { Container, LogoMark, ThemeToggle } from "@/components/common";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "projects", label: "Projects", href: "/#projects" },
  { key: "stack", label: "Stack", href: "/#stack" },
] as const;

type SiteHeaderProps = {
  activeNav?: (typeof navItems)[number]["key"];
};

export function SiteHeader({ activeNav }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-sm">
      <Container className="flex h-[52px] items-center justify-between px-6">
        <Link
          href="/#top"
          className="flex items-center gap-2 font-mono text-sm font-medium"
        >
          <LogoMark className="size-5" />
          ghalex<span className="text-primary">.dev</span>
        </Link>
        <nav className="flex items-center gap-[18px] text-[13px]">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                item.key === activeNav ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
