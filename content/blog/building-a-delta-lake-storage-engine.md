---
title: Building a Delta Lake storage engine from scratch
description: "Why I skipped Elasticsearch and ClickHouse and built LogzAI's storage layer on Parquet files, a transaction log, and DuckDB — and what it takes to make that survive millions of rows in production."
date: "2026-08-13"
readingTime: 10
tags:
  - delta-lake
  - duckdb
  - logzai
---

When I started LogzAI, the obvious move was to reach for Elasticsearch or ClickHouse and get on with the product. Instead I built the storage layer myself, on the [Delta Lake](https://delta.io) open format. This post is the full story of that engine — the write path, the query path, and the unglamorous maintenance loop that makes it survive production, where it now holds 6M+ logs for a single organization and answers full-dataset SQL queries in seconds.

Companies like Databricks have thousands of engineers working on this exact problem, so let me be precise about the claim. I didn't rebuild Spark. I built the thing a log platform actually needs: a complete ingestion-to-query engine — hot buffer, batching, partitioning, compaction, checkpointing, time travel, multi-tenant isolation, and a SQL surface over all of it — with no database server anywhere in the stack.

## Logs are a data problem, not a search problem

Log platforms are priced like search engines because they're built like search engines: everything gets indexed on ingest, and you pay for that indexing whether you ever query the data or not. But most logs are written once and read almost never — until an incident, when you suddenly want to scan *everything*.

That access pattern — cheap append-heavy writes, rare but heavy analytical reads — is exactly what the data-lake world solved years ago. Columnar files on object storage, a transaction log for consistency, a fast query engine on top. So the architecture became:

1. **Parquet** for the data files — columnar, heavily compressed, splittable.
2. **Delta Lake's transaction log** for atomic commits, schema evolution, and time travel — a folder of JSON files, no server.
3. **DuckDB** as the query engine — embedded, zero-ops, and shockingly fast over Parquet.

The whole thing runs identically on S3 or a local disk, and there is nothing to operate: no cluster, no JVM, no Spark. The Delta protocol itself I got from `delta-rs` — the same buy-the-protocol logic as adopting a geometry kernel: the spec is solved, and every hour spent reimplementing it is an hour not spent on the engine around it. The engine around it is where all the work went.

## The write path: logs arrive in dribbles, Parquet wants boulders

Here's the first thing nobody tells you about building on a lakehouse format: it hates small writes. Logs arrive over OTLP a few rows at a time, every few seconds, from every service. Write each little batch straight to Delta and you get two disasters at once — thousands of tiny Parquet files that make every future query slower, and a transaction-log commit per dribble that makes the log itself the bottleneck. This is the classic *small-file problem*, and solving it shaped the entire ingest design.

LogzAI's answer is a two-tier write path:

```
OTLP / CSV → parse → PyArrow table ──┬─ big batch?  → write to Delta directly
                                     └─ small batch → Redis buffer (Arrow IPC)
                                                        │  ≥ 5,000 rows
                                                        ▼
                                                  flush task → one Delta commit
```

Every incoming payload — OTLP protobuf logs, traces, even uploaded CSVs with auto-detected columns — is parsed and validated into a PyArrow table with a fixed schema. Attributes get sanitized on the way in (binary blobs replaced, strings over 100KB truncated), because one pathological log line must never poison a Parquet file.

Then the fork: large batches go straight to Delta. Small ones are appended to a **Redis buffer** as Arrow IPC bytes, with the running row count kept in metadata so checking "is it time to flush?" is O(1). When a buffer crosses 5,000 rows, a background flush task fires and turns the whole buffer into a single Parquet file and a single commit.

The concurrency details are where the real engineering lives, because ingestion never stops while a flush runs:

- The flush trigger is **debounced** with an atomically-set pending flag, so a burst of requests can't enqueue twenty identical flush tasks.
- The flush **atomically renames** the buffer to a separate "flushing" key. New logs keep landing in a fresh buffer immediately; the flush works on a frozen snapshot; a crashed flush loses nothing, because the flushing buffer is still sitting in Redis.

Data lands partitioned by organization, data type, source, and date — `org/logs/source=12/year=2026/month=8/day=13/` — which matches exactly how people query logs: *my* org, *this* service, *that* day.

## The query path: one SQL view over two storage tiers

The buffer creates an obvious problem: at any moment, the freshest few thousand logs are in Redis and everything else is in Delta. Users don't care. A log should be queryable the second it's ingested.

So the query layer makes the split invisible. Every query gets a fresh in-memory DuckDB connection, and the `logs` view is built as the union of both tiers:

```sql
CREATE VIEW logs AS
SELECT ... FROM delta_scan('s3://bucket/org/logs')
WHERE year = 2026 AND month = 8 AND day = 13   -- partition pruning
UNION ALL
SELECT ... FROM redis_logs;                     -- the Arrow buffer, registered as a table
```

DuckDB's `delta_scan` reads the transaction log and touches only the Parquet files that survive partition pruning; the Redis buffer is registered as a zero-copy Arrow table. On top sit three views — `logs`, `traces`, and `observability`, the union of both — so a single query can search everything the platform has ever seen. Pagination is cursor-based on `(ts, id)` tuples pushed into the views, so "load more" never re-scans what it already returned. And when a flush moves rows from Redis to Delta mid-session, no reader notices: the next query just finds the same rows on the other side of the `UNION ALL`.

This is the part that still feels like a magic trick: there is no database process anywhere. A query spins up an embedded engine, scans exactly the partitions it needs off object storage, unions in the hot buffer, and throws the connection away.

## The maintenance loop nobody blogs about

Writing rows is the easy 20%. A lakehouse that ingests continuously will degrade continuously unless something fights entropy on a schedule. Three background jobs do that fighting, per organization and per partition:

- **Compaction** — Delta's `OPTIMIZE` rewrites each partition's accumulation of flush-sized files into a few large Parquet files. Without it, query latency creeps up week by week until "seconds" becomes "minutes".
- **Vacuum** — compaction leaves the old small files behind (time travel needs them, briefly). Vacuum deletes files that fell out of the log's retention window, or storage grows without bound.
- **Checkpointing** — the transaction log itself is an append-only folder of JSON commits, and reading a table means replaying it. Every so often the engine writes a checkpoint (a Parquet snapshot of the log's state) and truncates the expired entries, so opening a table with tens of thousands of commits stays fast.

The scheduling matters as much as the operations: compaction runs per partition so it never stalls live ingestion of today's data, and it works on cold partitions the flush path has already left behind. None of this is glamorous, and all of it is the difference between a demo and a system that's still fast after months of continuous ingest.

## Multi-tenancy for free (almost)

Partitioning by organization gave isolation almost for free — every org's data lives under its own prefix, and no query can even construct a path into someone else's. But the open format enabled something better: **bring your own bucket**. An org can point LogzAI at their own S3 credentials, and the entire engine — writes, queries, compaction — runs against *their* infrastructure. Their logs never live on my servers, and because it's standard Delta Lake, they can point Spark, Polars, or pandas at the same files tomorrow. Try asking Elasticsearch for that.

## What it unlocked

Because the data sits in an open format queryable with plain SQL, the AI layer got dramatically simpler. Pattern detection, anomaly scoring, and natural-language chat over logs are all just SQL generation against DuckDB — no bespoke query DSL, no per-feature index. When a user asks a question, the model writes SQL, and the engine scans millions of rows in seconds.

That's the quiet payoff of the whole architecture. A search engine answers the queries its indexes anticipated; a columnar lake answers whatever SQL you write. An AI that can write SQL turns that into: whatever question you can ask.

The economics compound too. Storage costs are object-storage costs — compressed Parquet at S3 prices, no always-on cluster billing you for the 99% of logs nobody is reading. The indexing tax that log platforms pass on to you as per-GB ingest pricing simply doesn't exist here.

## What I'd tell you if you're attempting this

The parts that look hard — the transaction protocol, the columnar format, the query engine — are solved; adopt them. The parts that look trivial are where the months go: buffering small writes without losing any, flushing without blocking, compacting without stalling ingest, keeping the freshest data queryable next to the coldest, and doing all of it per tenant on a schedule. The engine isn't any single piece; it's the choreography.

If you're building something similar, those code-adjacent details — commit sizing, the atomic-rename flush, compaction heuristics, DuckDB tuning — are exactly what I'm happy to talk about. Reach me at [ghalex@gmail.com](mailto:ghalex@gmail.com) or [@ghalex](https://x.com/ghalex).
