import {
  Blocks,
  Bot,
  Cloud,
  CloudCog,
  Cloudy,
  FileSearch,
  GitMerge,
  GraduationCap,
  HardDrive,
  Network,
  Presentation,
  Server,
  Smartphone,
  Sprout,
  TabletSmartphone,
  TrendingUp,
  Triangle,
  UserPlus,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  siApachekafka,
  siApacheparquet,
  siC,
  siClaude,
  siCplusplus,
  siDocker,
  siDotnet,
  siDuckdb,
  siFastapi,
  siGooglecloud,
  siHtml5,
  siJavascript,
  siJquery,
  siKubernetes,
  siMoleculer,
  siMongodb,
  siNatsdotio,
  siNodedotjs,
  siPostgresql,
  siRabbitmq,
  siRedis,
  siPython,
  siReact,
  siSvg,
  siTypescript,
  siVuedotjs,
} from "simple-icons";

import { Pill, Section, SectionLabel } from "@/components/common";
import { stack } from "@/lib/content";

const brandIcons: Record<string, { path: string }> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  "C++": siCplusplus,
  C: siC,
  "C#": siDotnet,
  "Claude & LLM APIs": siClaude,
  Parquet: siApacheparquet,
  DuckDB: siDuckdb,
  "HTML & CSS": siHtml5,
  React: siReact,
  Vue: siVuedotjs,
  "SVG / charts": siSvg,
  "Every framework since jQuery": siJquery,
  "Node.js": siNodedotjs,
  "Moleculer microservices": siMoleculer,
  FastAPI: siFastapi,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Redis: siRedis,
  NATS: siNatsdotio,
  RabbitMQ: siRabbitmq,
  Kafka: siApachekafka,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  GCP: siGooglecloud,
};

const conceptIcons: Record<string, LucideIcon> = {
  "AI System Design": Network,
  "Multi-Agent Systems": Bot,
  "RAG Pipelines": FileSearch,
  "MCP & Tools": Wrench,
  "Agentic Workflows": Workflow,
  "Custom Architectures": Blocks,
  "Delta Lake": Triangle,
  "Storage engines": HardDrive,
  S3: Cloud,
  "React Native": Smartphone,
  "Mobile apps": TabletSmartphone,
  AWS: Cloudy,
  Azure: CloudCog,
  Linode: Server,
  "Real-time & event-driven": Zap,
  "Org building from zero": Sprout,
  "EM → Senior EM": TrendingUp,
  "Hiring at scale": UserPlus,
  "M&A team transition": GitMerge,
  "Pre-sales & RFPs": Presentation,
  "EM mentoring": GraduationCap,
};

function ItemIcon({ item }: { item: string }) {
  const brand = brandIcons[item];
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-3 shrink-0 fill-current text-muted-foreground"
      >
        <path d={brand.path} />
      </svg>
    );
  }
  const Concept = conceptIcons[item];
  if (Concept) {
    return <Concept aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />;
  }
  return null;
}

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
                <ItemIcon item={item} />
                {item}
              </Pill>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}
