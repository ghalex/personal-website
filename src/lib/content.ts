import type { BlogPost, Project, StackGroup } from "@/types";

export const site = {
  name: "Alexandru Ghiura",
  handle: "ghalex",
  domain: "ghalex.dev",
  tagline: "I build engineering organizations from zero.",
  description: "Founder, engineer, builder of things.",
  email: "ghalex@gmail.com",
  location: "Timisoara, Romania",
  locationShort: "Timisoara, RO",
  timeZone: "Europe/Bucharest",
  timeZoneLabel: "Timisoara (GMT+3)",
  shippingSince: "2006",
  x: "https://x.com/ghalex",
  github: "https://github.com/ghalex",
  linkedin: "https://linkedin.com/in/ghalex",
  logzai: "https://logzai.com",
  zenve3d: "https://zenve3d.com",
};

export const projects: Project[] = [
  {
    name: "Zenve3D",
    url: "https://zenve3d.com",
    role: "Founder · Professional parametric CAD for makers",
    meta: "beta",
    period: "2026 — now",
    active: true,
    bullets: [
      "Full parametric CAD — editable sketches, constraints, dimensions, features, and a complete modeling history — native on macOS and iPad.",
      "Modern C++ geometry engine built from the ground up for today’s hardware: touch and Pencil on iPad, full desktop workflows on the Mac.",
      "Built in public: a YouTube series documents the journey from empty viewport to production CAD — beta open on TestFlight.",
    ],
    tags: ["C++", "Swift", "Geometry kernel", "macOS", "iPad"],
  },
  {
    name: "LogzAI",
    url: "https://logzai.com",
    role: "Founder · AI-native log observability platform",
    meta: "active",
    period: "09.2025 — now",
    active: true,
    logoSrc: "/logos/logzai.svg",
    bullets: [
      "Solo-founded, designed, and built end-to-end: ingestion pipeline, AI pattern and anomaly detection, natural-language chat over logs, DuckDB-SQL query engine.",
      "Custom storage engine on the Delta Lake open format over S3 or local disk — 6M+ logs stored for a single organization, full-dataset SQL queries in seconds.",
      "One of 3 winning startups at the inVest accelerator Demo Day (EIT Urban Mobility, 51 applicants).",
    ],
    tags: [
      "TypeScript",
      "Node.js",
      "Python",
      "DuckDB",
      "Delta Lake",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    name: "Zapant",
    url: "https://zapant.com",
    role: "Co-Founder & CEO · Automated trading platform",
    meta: "300K+ tx",
    period: "01.2022 — 09.2025",
    active: false,
    bullets: [
      "Technical CEO of a 5-person team; the platform executed 300,000+ live transactions with users trading real money.",
      "Bootstrapped from AntSignals with an own-audience go-to-market and zero ad spend.",
      "Created Zplang, an open-source Clojure-inspired trading DSL in TypeScript, so users could write their own strategies.",
    ],
    tags: ["TypeScript", "React", "Node.js", "Zplang"],
  },
  {
    name: "AntSignals",
    url: "https://antsignals.com",
    role: "Solo founder · Trading-journal SaaS",
    meta: "€2K MRR",
    period: "2020 — now",
    active: true,
    bullets: [
      "Solo-built in 2020 and grown to ~€2K/month in subscription revenue, sustained over years.",
      "The audience and revenue base that bootstrapped Zapant.",
    ],
    tags: ["TypeScript", "Vue", "Node.js"],
  },
  {
    name: "vue3-charts",
    url: "https://github.com/ghalex/vue3-charts",
    role: "SVG charting library for Vue 3",
    meta: "150+ stars",
    period: "open source",
    active: false,
    bullets: [
      "SVG-based charting library that is very easy to use and highly customizable.",
    ],
    tags: ["Vue 3", "SVG", "TypeScript"],
  },
  {
    name: "PhiOS",
    url: "https://github.com/ghalex",
    role: "Operating system from scratch",
    meta: "hobby",
    period: "open source",
    active: false,
    bullets: [
      "Assembly bootloader, C++ kernel, bootable x86 image — built to understand how computers really work.",
    ],
    tags: ["Assembly", "C++", "x86"],
  },
];

export const stack: StackGroup[] = [
  { num: "01", name: "Languages", items: ["TypeScript", "JavaScript", "Python", "C#"] },
  {
    num: "02",
    name: "AI & Data",
    items: ["LLM systems", "RAG", "Agents", "Delta Lake", "Parquet", "DuckDB", "Big Data"],
  },
  {
    num: "03",
    name: "Backend",
    items: ["Node.js", "Microservices", "Distributed systems", "Docker", "Kubernetes"],
  },
  { num: "04", name: "Frontend", items: ["React", "Vue", "SVG / charts"] },
  { num: "05", name: "Cloud", items: ["AWS", "Azure", "GCP"] },
  {
    num: "06",
    name: "Leadership",
    items: [
      "Org building from zero",
      "M&A team transition",
      "Pre-sales & RFPs",
      "Hiring at scale",
      "EM mentoring",
    ],
  },
];

export const posts: BlogPost[] = [
  {
    title: "Building a Delta Lake storage engine from scratch",
    date: "draft — coming soon",
    href: "#blog",
  },
  {
    title: "What 100+ technical interviews taught me about hiring engineers",
    date: "draft — coming soon",
    href: "#blog",
  },
  {
    title:
      "From trading journal to trading platform: bootstrapping with your own audience",
    date: "draft — coming soon",
    href: "#blog",
  },
];
