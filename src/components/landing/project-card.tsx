import Image from "next/image";

import { Pill, RichText } from "@/components/common";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const renderLogo = () => (
    <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-border bg-stripes shadow-xs">
      {project.logoSrc && (
        <Image
          src={project.logoSrc}
          alt={`${project.name} logo`}
          width={44}
          height={44}
          className="size-full object-cover"
        />
      )}
    </div>
  );

  const renderRail = () => (
    <div className="flex flex-col items-center gap-2.5">
      {renderLogo()}
      <svg width="8" height="6" viewBox="0 0 8 6" className="-mb-1 shrink-0 text-border">
        <path d="M4 0L0.5 5h7z" fill="currentColor" />
      </svg>
      <div className="w-px flex-1 bg-border" />
      <svg width="8" height="6" viewBox="0 0 8 6" className="-mt-1 shrink-0 text-border">
        <path d="M4 6L0.5 1h7z" fill="currentColor" />
      </svg>
    </div>
  );

  const renderHeader = () => (
    <div className="flex min-h-11 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div className="flex flex-col gap-0.5">
        <a
          href={project.url}
          className="text-[17px] font-semibold tracking-[-0.01em] transition-colors hover:text-primary"
        >
          {project.name}{" "}
          <span className="font-mono text-[11px] font-normal text-muted-foreground">
            ↗
          </span>
        </a>
        <span className="text-[13px] text-muted-foreground">{project.role}</span>
      </div>
      <div className="flex items-center gap-2 sm:shrink-0 sm:flex-col sm:items-end sm:gap-1">
        <Pill variant="meta">
          {project.active && (
            <span className="inline-block size-1.5 rounded-full bg-primary" />
          )}
          {project.meta}
        </Pill>
        <span className="font-mono text-[11px] text-muted-foreground">
          {project.period}
        </span>
      </div>
    </div>
  );

  return (
    <article className="grid grid-cols-[44px_1fr] gap-x-4 border-t border-border p-6 transition-colors hover:bg-card">
      {renderRail()}
      <div className="flex min-w-0 flex-col">
        {renderHeader()}
        <div className="mt-3.5 flex flex-col gap-2 text-[13.5px] leading-[1.6] text-pretty">
          {project.bullets.map((bullet) => (
            <div key={bullet} className="flex gap-2.5">
              <span className="shrink-0 font-mono text-xs leading-[1.8] text-primary">
                —
              </span>
              <span>
                <RichText text={bullet} />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Pill key={tag} variant="tag">
              {tag}
            </Pill>
          ))}
        </div>
      </div>
    </article>
  );
}
