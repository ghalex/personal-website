import { Section } from "@/components/common";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const renderCell = (
    label: string,
    value: React.ReactNode,
    withBorder = true,
  ) => (
    <div
      className={cn(
        "flex flex-col gap-1.5 px-6 py-4",
        withBorder && "border-r border-border",
      )}
    >
      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-[13px]">{value}</span>
    </div>
  );

  return (
    <Section>
      <footer>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 py-[18px]">
          <span className="font-mono text-sm font-medium">
            ghalex<span className="text-primary">.dev</span>
          </span>
          <span className="text-[13px] text-muted-foreground">{site.description}</span>
        </div>
        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
          {renderCell(
            "Crafted by",
            <a href={site.github} className="link">
              @{site.handle}
            </a>,
          )}
          {renderCell("Location", site.locationShort)}
          {renderCell("Shipping since", site.shippingSince)}
          {renderCell(
            "For agents",
            <a href="/agents.md" className="link">
              agents.md
            </a>,
            false,
          )}
        </div>
        <div className="grid grid-cols-1 border-b border-border sm:grid-cols-2">
          {renderCell(
            "Now building",
            <>
              <a href={site.zenve3d} className="link">
                Zenve3D
              </a>{" "}
              <span className="text-border">{"//"}</span>{" "}
              <a href={site.llmbrain} className="link">
                LLMBrain
              </a>
            </>,
          )}
          {renderCell(
            "Contact",
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>,
            false,
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <span className="font-mono text-xs text-muted-foreground">
            © 2026 {site.name}
          </span>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href={site.x}
              title="X"
              className="flex transition-colors hover:text-foreground"
            >
              <XIcon size={15} />
            </a>
            <a
              href={site.github}
              title="GitHub"
              className="flex transition-colors hover:text-foreground"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={site.linkedin}
              title="LinkedIn"
              className="flex transition-colors hover:text-foreground"
            >
              <LinkedinIcon size={15} />
            </a>
          </div>
        </div>
      </footer>
    </Section>
  );
}
