---
title: "The Ralph loop: running coding agents for hours without losing the plot"
description: "Why long agent sessions decay, how a dumb bash loop fixes it, and how LLMBrain's /work-on-milestone skill turns a milestone into a Ralph loop with a persistent brain as the state store."
date: "2026-08-22"
readingTime: 8
tags:
  - llmbrain
  - agents
  - ralph-loop
---

Anyone who has run a coding agent on a real task — not a demo, a multi-hour grind through a milestone — has watched the same decay curve. The first hour is sharp. By the third, the agent is re-reading files it already read, contradicting decisions it made earlier, and confidently "fixing" things it broke twenty minutes ago. Nothing is wrong with the model. What's wrong is the session: the context window has filled up with stale file dumps, dead ends, and its own chatter, and the signal is drowning in it.

The fix that actually works in practice is embarrassingly stupid, and it has a name: the **Ralph loop**.

## What a Ralph loop is

The technique comes from [Geoffrey Huntley](https://ghuntley.com/ralph/), who named it after Ralph Wiggum from The Simpsons — the kid who is not the sharpest but keeps cheerfully showing up. In its original form it is literally this:

```bash
while :; do
  cat PROMPT.md | claude
done
```

That's it. Run the agent with the same prompt, in a fresh session, forever. Each iteration the agent wakes up blank, reads the plan file, picks the most important unfinished item, does that one thing, writes its progress back to disk, and dies. The loop restarts it. Repeat until the plan is empty.

The genius is in what the loop *doesn't* do. It doesn't try to keep one long-lived, ever-smarter session alive. It accepts that a fresh context window is the most valuable resource an agent has, and spends it deliberately: one full window per unit of work, then throw the session away.

People have used this to build entire codebases overnight. Not because each iteration is brilliant — individual iterations occasionally do something profoundly dumb, which is why it's named after Ralph — but because the loop is relentless and the dumb iterations get corrected by later ones. It's stochastic gradient descent for software: noisy steps, consistent direction.

## The problem it actually solves

It's worth being precise about the failure mode, because "the context window is too small" is not it. Windows are enormous now. The problem is that **an agent's judgment degrades long before its window fills** — retrieval gets worse, instructions from fifty turns ago stop binding, and the model starts attending to its own earlier mistakes as if they were ground truth. The industry has settled on calling this context rot.

You cannot prompt your way out of it, because the prompt is *in* the rotting context. The only real fix is architectural:

**State lives outside the model. Sessions are disposable.**

Once you frame it that way, the Ralph loop stops looking like a hack and starts looking like a design pattern. The deterministic outer loop (bash) holds nothing. The stochastic inner agent holds everything — for exactly one task. Between iterations, the only thing that survives is whatever the agent wrote down: files on disk, commits in git, checkboxes in a plan.

Which exposes the pattern's one weak point. **A Ralph loop is only as good as its external memory.** The naive version stores state in markdown files scattered through the repo — `PROMPT.md`, `fix_plan.md`, a `TODO` section the agent rewrites every pass. It works, but it's fragile: the plan file and reality drift apart, "why did we decide this?" has no home and gets re-litigated every third iteration, and none of it carries across repos or machines. The loop has a body; what it needs is a brain.

## LLMBrain as the loop's memory

This is exactly the shape [LLMBrain](https://llmbrain.dev) was built for. It's a hosted MCP server that acts as a cross-project brain for coding agents: canonical docs per project (architecture, data model, product, status), milestones and issues as the roadmap, an append-only decision log, and small remembered facts — all readable and writable by the agent itself, from any session, in any repo clone.

Wire that into a Ralph loop and every piece of loop state gets a proper home:

```
                        ┌─────────────────────────────┐
                        │           LLMBrain           │
                        │                              │
        start_session ──▶  status doc   "where we are" │
        get_issue     ──▶  issues       the work queue │
        add_comment   ──▶  comments     handoff notes  │
        add_decision  ──▶  decisions    the "why" log  │
                        └──────────────▲───────────────┘
                                       │ read / write
              ┌────────────────────────┴───────────────────────┐
              │                                                │
   ┌──────────┴─────────┐    fresh context per issue   ┌───────┴────────┐
   │   iteration N      │  ─────────────────────────▶  │  iteration N+1 │
   │  pick issue → work │      (session dies here)     │  pick → work   │
   └────────────────────┘                              └────────────────┘
```

Concretely, each iteration of the loop maps onto brain calls:

- **Orientation** is one call. `start_session` returns the project card, the status doc, and the open issues — the agent knows where the last iteration left off without grepping the repo for a plan file.
- **The work queue is the issue tracker**, not a markdown list. Each issue has a real body (the spec) and a comment thread. The agent marks an issue `in_progress` when it picks it up and `done` when it finishes, so the queue can never silently drift from reality.
- **Handoffs are issue comments.** An iteration that dies mid-task leaves a comment: what it tried, what failed, where to resume. The next fresh session reads it and continues instead of rediscovering.
- **Reasoning outlives the session.** Every "chose X over Y because Z" goes into the decision log. This is the single biggest upgrade over file-based Ralph: fresh iterations inherit not just the state of the work but the *why*, which is precisely what stops iteration twelve from cheerfully undoing iteration four.

The loop stays dumb. The memory gets smart. And because the brain is hosted and cross-project, the same loop pattern works on every project you own, with nothing to set up in the repo.

## /work-on-milestone: a Ralph loop as a skill

LLMBrain ships this as a skill, so you don't hand-assemble the loop. In Claude Code:

```
/work-on-milestone M1
```

Here's what that looks like on a real project — the master agent opening the loop on a Zenve3D milestone, ordering twelve issues into a queue and handing the first one to a fresh worker:

![Claude Code terminal running a Ralph loop: the master agent lists a 12-issue milestone queue and spawns a dedicated worker agent for the first issue](/blog/running-agents-in-a-ralph-loop/ralph-loop.jpeg)

This starts a Ralph loop over everything in the milestone — with one twist on the classic recipe. Instead of a bash `while` loop restarting the whole process, there is a **master agent** that never writes code. Its instructions open with the whole idea in two sentences: *you do not write the code; you pick the work, hand each issue to a fresh worker agent, and keep the brain honest about where things stand.* The master's context stays cheap — it holds conclusions, never file contents — so it can run the loop for hours without rotting itself.

Each pass through the loop:

1. The master resolves the milestone and orders the queue — cheap, isolated issues first; the big ones everything depends on last.
2. It pulls the next issue in full, including comments, and marks it `in_progress`.
3. It spawns a **fresh worker agent** — the Ralph iteration. The worker starts completely blank and gets a self-contained briefing: how to orient in the brain, the issue summarized plus "read the full body, it is the spec", what's explicitly *out of scope*, the user's standing rules verbatim (don't push, don't branch — whatever the project's preferences doc says), and which quality gates it owes, with the instruction to report the gates' actual output.
4. The worker burns its whole context window on that one issue, comments its results on the issue thread, and reports back.
5. The master marks the issue `done` — deliberately its job, not the worker's, so a worker that dies silently can't close work it didn't finish — relays a two-line summary to you, and picks the next issue.

Workers run **sequentially, not fanned out**, because issues in one milestone routinely touch the same files, and two agents editing one working tree corrupt each other in ways that surface hours later. And when an issue says "owner's call", the master doesn't stall the queue to ask: reversible calls with a cheap option get taken and flagged in the relay; irreversible or product-shaped ones get parked for you. You launched a loop precisely so you wouldn't have to sit in it.

The loop ends when the milestone has no open issues, when you stop it, or when everything left needs a human decision. On the way out it does the thing naive Ralph loops always skip: comments on any unfinished issue with the tree state and where to resume, records the loop's own decisions, and updates the status doc — so the *next* loop's first `start_session` call starts exactly where this one stopped.

## The takeaway

The Ralph loop's insight is that agent sessions should be cattle, not pets: fresh context per unit of work, all state external, let the loop grind. What the original bash version leaves unsolved is the quality of that external state — and that, more than the loop itself, is what determines whether hour six is still productive.

Give the loop a real brain — a queue that can't drift, handoffs that survive death, decisions that don't get re-litigated — and the pattern stops being a party trick for overnight demos and becomes a way you actually ship: point it at a milestone, walk away, and come back to a working tree and an honest account of what happened.

`/work-on-milestone M1`. That's the whole workflow.
