import type { BlogPost, Project, PublishedPost, StackGroup } from "@/types";

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
    slug: "building-a-delta-lake-storage-engine",
    title: "Building a Delta Lake storage engine from scratch",
    description:
      "Why I skipped Elasticsearch and ClickHouse and built LogzAI's storage layer on Parquet files, a transaction log, and DuckDB.",
    date: "2026-08-13",
    readingTime: 7,
    tags: ["delta-lake", "duckdb", "logzai"],
    body: [
      {
        type: "p",
        content: [
          "When I started LogzAI, the obvious move was to reach for Elasticsearch or ClickHouse and get on with the product. Instead I spent the first weeks building a storage engine on the ",
          { text: "Delta Lake", href: "https://delta.io" },
          " open format. This post is about why, and what I learned shipping it to production — where it now holds 6M+ logs for a single organization and answers full-dataset SQL queries in seconds.",
        ],
      },
      { type: "h2", text: "Logs are a data problem, not a search problem" },
      {
        type: "p",
        content: [
          "Log platforms are priced like search engines because they're built like search engines: everything gets indexed on ingest, and you pay for that indexing whether you ever query the data or not. But most logs are written once and read almost never — until an incident, when you suddenly want to scan ",
          { text: "everything", em: true },
          ".",
        ],
      },
      {
        type: "p",
        content: [
          "That access pattern — cheap append-heavy writes, rare but heavy analytical reads — is exactly what the data-lake world solved years ago. Columnar files on object storage, a transaction log for consistency, and a fast query engine on top. So the architecture became:",
        ],
      },
      {
        type: "steps",
        items: [
          [
            { text: "Parquet", strong: true },
            " for the data files — columnar, heavily compressed, splittable.",
          ],
          [
            { text: "Delta Lake's transaction log", strong: true },
            " for atomic commits, schema evolution, and time travel — a folder of JSON files, no server.",
          ],
          [
            { text: "DuckDB", strong: true },
            " as the query engine — embedded, zero-ops, and shockingly fast over Parquet.",
          ],
        ],
      },
      {
        type: "p",
        content: [
          "The result runs identically on S3 or a local disk. There is no database server to operate. Storage costs are object-storage costs.",
        ],
      },
      { type: "h2", text: "Why write the Delta layer myself" },
      {
        type: "p",
        content: [
          "There are good Delta Lake libraries, but they assume a Spark-shaped world. LogzAI's ingestion path is a Node.js service that needs to commit small batches every few seconds without JVM overhead. Writing the transaction-log protocol myself — it's a well-specified, readable format — gave me exact control over commit sizes, compaction scheduling, and checkpointing, and it turned out to be less code than integrating the heavyweight alternatives.",
        ],
      },
      {
        type: "p",
        content: [
          "The parts that actually took time were the unglamorous ones: concurrent-writer conflict resolution, small-file compaction that doesn't stall ingestion, and partitioning that matches how people query logs (by organization, then time).",
        ],
      },
      { type: "h2", text: "What it unlocked" },
      {
        type: "p",
        content: [
          "Because the data sits in an open format queryable with plain SQL, the AI layer got dramatically simpler. Pattern detection, anomaly scoring, and natural-language chat over logs are all just SQL generation against DuckDB — no bespoke query DSL, no per-feature index. When a user asks a question, the model writes SQL, and the engine scans millions of rows in seconds.",
        ],
      },
      {
        type: "p",
        content: [
          "And there's no lock-in, in either direction: any tool that reads Delta Lake can read a customer's logs, today.",
        ],
      },
      {
        type: "p",
        content: [
          "If you're building something similar, the code-adjacent details — commit protocol, compaction heuristics, DuckDB tuning — are exactly what I'm happy to talk about. Reach me at ",
          { text: "ghalex@gmail.com", href: "mailto:ghalex@gmail.com" },
          " or ",
          { text: "@ghalex", href: "https://x.com/ghalex" },
          ".",
        ],
      },
    ],
  },
  {
    slug: "what-100-interviews-taught-me-about-hiring",
    title: "What 100+ technical interviews taught me about hiring engineers",
  },
  {
    slug: "bootstrapping-with-your-own-audience",
    title:
      "From trading journal to trading platform: bootstrapping with your own audience",
  },
];

export function isPublished(post: BlogPost): post is PublishedPost {
  return Boolean(post.date && post.body);
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
