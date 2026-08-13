import { Section, SectionLabel } from "@/components/common";
import { ProjectCard } from "@/components/landing/project-card";
import { projects } from "@/lib/content";

export function ProjectsSection() {
  return (
    <Section id="projects">
      <div className="p-6 pb-[18px]">
        <SectionLabel>
          Projects <span className="text-primary">({projects.length})</span>
        </SectionLabel>
      </div>
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </Section>
  );
}
