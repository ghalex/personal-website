---
title: "How I started Zenve3D: parametric CAD, from an empty viewport"
description: "Why I decided to build a professional CAD app for Mac and iPad, the technical bets that made it possible, and the problems that turned out to be the actual product."
date: "2026-08-18"
readingTime: 9
tags:
  - zenve3d
  - cad
  - opencascade
---

After LogzAI I started something that, on paper, a solo founder has no business attempting: a professional parametric CAD application. [Zenve3D](https://zenve3d.com) is native CAD for macOS and iPad, aimed at makers — 3D-printed enclosures, brackets, parts for the electronics projects on your desk. Sketch, constrain, dimension, extrude, with a full history timeline where changing an early dimension rebuilds the whole part.

The first commit landed at the end of July. Two and a half weeks later the app was in open beta on TestFlight, exporting STEP files that round-trip through Fusion 360 and Shapr3D. This post is about why I started it, the decisions that made that pace possible, and the technical problems that turned out to be the actual product.

## Why CAD, and why now

The itch was personal. Every maker project I touch eventually needs a custom part — a case for a board, a mounting plate for a motor — and the tools for designing one force a bad choice. Professional CAD is genuinely capable and priced for companies: subscriptions, ecosystems you don't control, and near-total indifference to the iPad, which is exactly the device a lot of people want to design on. The affordable end of the market gives you either meshes you can't edit precisely or web apps that don't feel native anywhere.

The product bet is narrow enough to state in one sentence: **precision parametric CAD can feel native on a touch screen**, and a single person can build it if they're ruthless about what to build versus what to buy.

CAD is also the classic graveyard for ambitious solo projects, and I knew that going in. So the way I started mattered more than usual.

## De-risk first, product later

I didn't start with product code. I started with a list of assumptions that would kill the project if false, ordered by how likely they were to be false, and I attacked the worst one first.

The worst one was: *does a serious geometry kernel even compile for an iPad?* I budgeted a week of cross-compilation misery for that spike. It took hours. OpenCASCADE 7.9.3 cross-compiles for iOS arm64 with no patches, provided you switch every optional dependency off — no Tcl/Tk, no FreeType, no TBB, no visualization stack at all. The other spike-killer worry, binary size, evaporated the same day: statically linked OCCT is 71 MB per slice as a library, but the linker dead-strips everything the app never calls. The release binary is 4.7 MB.

That spike code was deleted the moment it answered its question — it was a demo, not an architecture. But the habit it set stuck: every milestone since has had an **exit criterion, not a date**. M1 wasn't "build the document model", it was "edit a dimension on a parametric box on a physical iPad, watch the solid rebuild, reject a bad expression with the old solid still on screen, undo." When that demo ran, the milestone was over. Plans written months ahead of contact with reality are fiction, so I never write them.

## The one decision you don't get to revisit

The geometry kernel — the code that represents solids exactly and performs the booleans that cut and join them — is the decision everything else gets shaped around. Parasolid and ACIS have been in development since the 1980s and are still fixing edge cases; that's the scale of what you're choosing between.

I've written the full analysis [on the Zenve3D blog](https://zenve3d.com/blog/choosing-a-geometry-kernel), but the short version: commercial kernels have licensing terms that don't fit "indie app on an iPad"; writing my own is the classic way CAD projects die (the data structures are a semester, robust booleans are a decade); and the promising Rust newcomers have no fillets and no STEP. That leaves OpenCASCADE — the only serious open-source B-rep kernel, LGPL, with everything I needed and the one property that was non-negotiable: it builds for iOS.

Adopting OCCT decided my language for me. OCCT is C++, so the engine is C++ — a forced move I embraced, because C++ is also the one language that compiles in-process on every platform I care about: iPad, Mac, Windows someday, WebAssembly for a future web client. The architecture that fell out is one **portable C++ engine** holding all the brains — document model, rebuild engine, expressions, the sketch solver, OCCT itself — and **thin native shells** that do rendering and input, nothing more. One SwiftUI client covers both iPad and Mac. Everything subtle and hard to get right twice exists exactly once.

The rule that keeps a 25-year-old kernel from colonizing the codebase has teeth: **OCCT types never cross the engine's boundary.** Clients see a plain C façade — opaque IDs, flat structs, typed errors. That quarantine pays constantly. The engine compiles headless on Linux, so CI replays command scripts and asserts on the resulting geometry with no device and no simulator. And kernel failures become *states* instead of crashes: a feature that fails is marked failed in the timeline, downstream features are blocked, you fix it and rebuild. A kernel error must never take the app down.

## The challenges nobody warns you about

**Sketches are equation systems.** Every constraint — coincident, tangent, a typed dimension — is an equation, and dragging a line means asking a solver to re-satisfy all of them many times per second. I adopted here too: libslvs, the solver extracted from SolveSpace, vendored with a handful of patches. The biggest performance lever isn't the math, it's never solving the whole sketch — constraints cluster into islands, and only the islands your drag touches get re-solved. One of my patches, an allocation-arena change, took a heavy benchmark sketch from 322 ms to 67 ms. The UX rule the solver serves: a failed solve should feel like *resistance, not breakage* — the sketch keeps its last valid state and shows you which constraints are fighting, and it never snaps into a corrupted arrangement.

**Geometry is a cached output.** The document model isn't shapes — it's the *recipe* that produces them. Your saved project is a replayable history, and the solids on screen are just what replaying it computes. This is what makes "change a parameter, watch the part rebuild" possible at all, and it creates the hardest problem in the codebase: **persistent references**. When you fillet "the top edge" and a later edit re-deals the kernel's entire face and edge enumeration, something has to keep "the edge you meant" meaningful. No kernel solves that for you. Deciding *which* solids, *when*, and *what they mean* — that's the part I actually built. The kernel computes; the product is everything around it.

**Even file export fights you.** The engine contains no filesystem code (a WASM build has no filesystem), and OCCT's STL writer takes a file path. So Zenve3D's STL export is hand-rolled — 84 header bytes, 50 per triangle, streamed out through the same byte-oriented door as everything else. By the time STEP export shipped, OCCT's newer stream APIs meant the boundary cost nothing. That's the thing about architectural rules: they charge you early and pay you late.

## The part I didn't plan: AI as a first-class user

Underneath every Zenve3D project is a plain-text command language, `.zcmd` — one command per line, dimensions as expressions over named parameters. It existed for autosave and for CI. Then I realized what else it was: the perfect interface for an LLM.

But there's a catch, and it's the technically interesting one. **A language model cannot predict the numbers a geometry kernel produces.** Sketch a plate with a hole and the sketch encloses *two* regions; which one is region 0 comes out of a decomposition only the engine can run. Cut a hole in a body and the kernel re-deals the entire face list — "face 5" means something different after the cut. A blind script can be wrong *silently* even when every line parses, which is exactly the failure a CAD tool must never allow.

So the AI integration is a loop, not a code generator. Through an MCP server, an agent writes a few lines, runs them through the *real* engine, and reads back a report — degrees of freedom, region decompositions, face normals and centroids — as ground truth before writing the next lines. Ask Claude for an Arduino case and what comes back isn't a mesh you accept or discard; it's a parametric project with `width`, `depth` and `wall` sitting in the Parameters panel, ready to drag. That story has [its own post](https://zenve3d.com/blog/any-ai-can-build-parts-in-zenve3d).

## Where it is now

Zenve3D is in open beta on TestFlight, free while the beta runs, on macOS and iPad. STEP flows both directions — export exact solids, import a vendor's board model and design the enclosure around the real thing. Feature patterns, expression-driven everything, and the AI loop all shipped in the last releases. Next up: rigid mates between parts, so a lid seats on its box on screen instead of being eyeballed.

The whole build is documented in public [on YouTube](https://www.youtube.com/@thezen86) — architecture decisions, difficult bugs, the experiments that went nowhere. No roadmap theatre: what's shipped is shipped, and what's missing is named as missing.

The lesson I'd pass on from starting this one: in a domain with a graveyard, buy the twenty years of numerical robustness you can't recreate, and spend your own time exactly where no library can help you. For Zenve3D that meant adopting a kernel and a solver — and building the recipe model, the reference layer, the constraint UX, and the AI loop that no kernel will ever give you.

If you're building something in CAD, geometry, or agent-native tooling, the details I glossed over — the reference-resolution scheme, the solver patches, the MCP report format — are exactly what I'm happy to talk about. Reach me at [ghalex@gmail.com](mailto:ghalex@gmail.com) or [@ghalex](https://x.com/ghalex).
