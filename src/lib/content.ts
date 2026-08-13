import type { BlogPost, Project, PublishedPost, StackGroup } from "@/types";

export const site = {
  name: "Alexandru Ghiura",
  handle: "ghalex",
  domain: "ghalex.dev",
  tagline: "I love building products from zero.",
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

export const about = [
  "I'm a builder at heart. After 20 years in software I keep coming back to the same thing: taking an idea from zero to a working product with my own hands — the storage engine, the UI, the go-to-market, all of it.",
  "Right now that means [LogzAI](https://logzai.com), an AI-native log observability platform I built solo on a hand-built Delta Lake storage engine (one of 3 winners at the inVest accelerator Demo Day), and [Zenve3d](https://zenve3d.com), my newest venture. Before these I co-founded Zapant, a trading platform that executed 300K+ live transactions, bootstrapped from AntSignals — a trading-journal SaaS I grew to ~€2K/month with zero ad spend.",
  "I like hard technical problems (I once wrote an OS from scratch), small teams, and products that make money without permission.",
];

export const projects: Project[] = [
  {
    name: "Zenve3D",
    url: "https://zenve3d.com",
    role: "Founder · Professional parametric CAD for makers",
    meta: "beta",
    active: true,
    logoSrc: "/logos/draw/zenve3d-sketch.png",
    bullets: [
      "**Full parametric CAD** — editable sketches, constraints, dimensions, features, and a complete modeling history: change an early dimension and the rest of the model updates with it.",
      "Every field takes **expressions** — a parameter's name works anywhere a number does.",
      "One modern **C++ geometry engine**, native on macOS and iPad — touch and Pencil on the tablet, full desktop workflows on the Mac.",
      "Built-in **MCP server** — AI assistants plug straight into the modeler: sketch, model, and inspect parts through natural language.",
      "Professional CAD workflows **without enterprise complexity or enterprise pricing** — built for makers: 3D-printed parts, CNC components, robotics, enclosures, prototypes.",
    ],
    tags: ["C++", "Swift", "Geometry kernel", "MCP", "macOS", "iPad"],
  },
  {
    name: "LogzAI",
    url: "https://logzai.com",
    role: "Founder · AI-native log observability platform",
    meta: "active",
    active: true,
    logoSrc: "/logos/draw/logzai-sketch-v3.png",
    bullets: [
      "**AI-native log analysis** — chat with your logs, get any log explained, and let automatic pattern and anomaly detection surface problems before you go looking.",
      "**Purpose-built log agent** — custom tool suite and prompt architecture that plans multi-step investigations across millions of logs and answers with evidence.",
      "Custom storage engine on the **Delta Lake open format**, over S3 or local disk — **6M+ logs** for a single organization, full-dataset SQL queries in seconds.",
      "**Full SQL** over everything through DuckDB — query builder with attribute filters, saved and shared queries, and smart alerts when something goes wrong.",
      "Open format end-to-end: no bespoke index, **no lock-in** — any tool that reads Delta Lake can read your logs.",
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
    active: false,
    logoSrc: "/logos/draw/zapant-sketch.png",
    bullets: [
      "**Automated trading bots** for stocks and crypto — pick a public bot with strict risk-management protocols, connect your broker, and go live in minutes.",
      "[**Zplang**](https://zaplang.com), an open-source Clojure-inspired trading language with built-in assets and indicators — a strategy is a few lines of code, backtested and executed from the terminal with [**ZapCLI**](https://zapcli.com).",
      "**Custom strategies** — write your own bots in JavaScript or Zplang and run them live on the platform.",
      "**300,000+ live transactions** executed against real brokers, with real money on the line.",
    ],
    tags: ["TypeScript", "React", "Node.js", "Zplang"],
  },
  {
    name: "AntSignals",
    url: "https://antsignals.com",
    role: "Solo founder · Trading-journal SaaS",
    meta: "€2K MRR",
    active: true,
    logoSrc: "/logos/draw/zapant-sketch.png",
    bullets: [
      "**A trading journal that finds your edge** — import trades straight from your broker and let the reports show which setups make money and which quietly bleed it.",
      "**Data-driven feedback** on everything: peak-performance hours, position sizing, pattern and mistake detection — across stocks, indices, forex, options, and crypto.",
      "**AI insights, a trade simulator**, and multiple portfolios with customizable reports and rich data visualization.",
      "Independently reviewed — [Bullish Bears](https://bullishbears.com/antsignals-review/) calls its **data-driven feedback** the platform's biggest strength.",
    ],
    tags: ["TypeScript", "Vue", "Node.js"],
  },
  {
    name: "vue3-charts",
    url: "https://github.com/ghalex/vue3-charts",
    role: "SVG charting library for Vue 3",
    meta: "150+ stars",
    active: false,
    logoSrc: "/logos/draw/vue3charts-sketch.png",
    bullets: [
      "**#1 search result for “vue3 charts”** — SVG charting for Vue 3, intuitive and extensible.",
      "**Charts are templates** — Grid, Bar, Line, and Area compose as declarative layers.",
      "Docs and live examples at [vue3charts.org](https://vue3charts.org).",
      "Built on top of **D3** — D3's math, Vue's reactivity.",
    ],
    tags: ["Vue 3", "SVG", "TypeScript"],
  },
  {
    name: "PhiOS",
    url: "https://github.com/ghalex/phios",
    role: "Operating system from scratch",
    meta: "hobby",
    active: false,
    bullets: [
      "**Boots on bare metal** — assembly bootloader into a C++ kernel, shipped as a bootable x86 image.",
      "**C++ with no OS underneath** — hand-rolled runtime support, VGA text driver, port-I/O layer, custom linker script.",
      "Runs in **QEMU** straight from the repo — x64 and ARM ports sketched in the tree.",
    ],
    tags: ["Assembly", "C++", "x86"],
  },
];

export const stack: StackGroup[] = [
  {
    num: "01",
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "C", "C#"],
  },
  {
    num: "02",
    name: "AI Engineering",
    items: [
      "AI System Design",
      "Multi-Agent Systems",
      "RAG Pipelines",
      "MCP & Tools",
      "Agentic Workflows",
      "Custom Architectures",
      "Claude & LLM APIs"
    ],
  },
  {
    num: "03",
    name: "Data",
    items: ["Delta Lake", "Parquet", "DuckDB", "Storage engines", "S3"],
  },
  {
    num: "04",
    name: "Backend",
    items: [
      "Node.js",
      "Moleculer microservices",
      "FastAPI",
      "Real-time & event-driven",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "NATS",
      "RabbitMQ",
      "Kafka",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    num: "05",
    name: "Frontend",
    items: [
      "HTML & CSS",
      "React",
      "React Native",
      "Vue",
      "Mobile apps",
      "SVG / charts",
      "Every framework since jQuery",
    ],
  },
  { num: "06", name: "Cloud", items: ["AWS", "Azure", "GCP", "Linode"] },
  {
    num: "07",
    name: "Leadership",
    items: [
      "Org building from zero",
      "EM → Senior EM",
      "Hiring at scale",
      "M&A team transition",
      "Pre-sales & RFPs",
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
