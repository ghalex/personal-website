---
title: Building a Delta Lake storage engine from scratch
description: "Why I skipped Elasticsearch and ClickHouse and built LogzAI's storage layer on Parquet files, a transaction log, and DuckDB."
date: "2026-08-13"
readingTime: 7
tags:
  - delta-lake
  - duckdb
  - logzai
---

When I started LogzAI, the obvious move was to reach for Elasticsearch or ClickHouse and get on with the product. Instead I spent the first weeks building a storage engine on the [Delta Lake](https://delta.io) open format. This post is about why, and what I learned shipping it to production — where it now holds 6M+ logs for a single organization and answers full-dataset SQL queries in seconds.

## Logs are a data problem, not a search problem

Log platforms are priced like search engines because they're built like search engines: everything gets indexed on ingest, and you pay for that indexing whether you ever query the data or not. But most logs are written once and read almost never — until an incident, when you suddenly want to scan *everything*.

That access pattern — cheap append-heavy writes, rare but heavy analytical reads — is exactly what the data-lake world solved years ago. Columnar files on object storage, a transaction log for consistency, and a fast query engine on top. So the architecture became:

1. **Parquet** for the data files — columnar, heavily compressed, splittable.
2. **Delta Lake's transaction log** for atomic commits, schema evolution, and time travel — a folder of JSON files, no server.
3. **DuckDB** as the query engine — embedded, zero-ops, and shockingly fast over Parquet.

The result runs identically on S3 or a local disk. There is no database server to operate. Storage costs are object-storage costs.

## Why write the Delta layer myself

There are good Delta Lake libraries, but they assume a Spark-shaped world. LogzAI's ingestion path is a Node.js service that needs to commit small batches every few seconds without JVM overhead. Writing the transaction-log protocol myself — it's a well-specified, readable format — gave me exact control over commit sizes, compaction scheduling, and checkpointing, and it turned out to be less code than integrating the heavyweight alternatives.

The parts that actually took time were the unglamorous ones: concurrent-writer conflict resolution, small-file compaction that doesn't stall ingestion, and partitioning that matches how people query logs (by organization, then time).

## What it unlocked

Because the data sits in an open format queryable with plain SQL, the AI layer got dramatically simpler. Pattern detection, anomaly scoring, and natural-language chat over logs are all just SQL generation against DuckDB — no bespoke query DSL, no per-feature index. When a user asks a question, the model writes SQL, and the engine scans millions of rows in seconds.

And there's no lock-in, in either direction: any tool that reads Delta Lake can read a customer's logs, today.

If you're building something similar, the code-adjacent details — commit protocol, compaction heuristics, DuckDB tuning — are exactly what I'm happy to talk about. Reach me at [ghalex@gmail.com](mailto:ghalex@gmail.com) or [@ghalex](https://x.com/ghalex).
