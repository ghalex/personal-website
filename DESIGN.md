# ghalex.dev — Style Reference
> Engineering-blueprint portfolio: a single bordered rail, mono labels, stripe bands, one green accent.

**Theme:** light + dark (class-based, default light, persisted in `localStorage["ghalex-theme"]`)

The design language is a "technical drawing" aesthetic imported from the Claude Design project `ghalex.dev.dc.html`: an off-white page carrying one centered, side-ruled column (max-width **692px**) whose left/right borders run the full page height. Sections are separated by hairline borders, headings are uppercase mono micro-labels, and diagonal-stripe bands mark the page's structural seams. A single green accent is the only chromatic color. Tokens live in `src/app/globals.css` (`:root` / `.dark`) under the standard shadcn semantic names — keep this file and that one in sync.

## Tokens — Colors

Defined as OKLCH variables in `src/app/globals.css`, exposed via `@theme inline`. Use semantic utilities (`bg-background`, `text-primary`, …) — never hardcode hex.

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--background` | `oklch(0.9911 0 0)` ≈ #fcfcfc | `oklch(0.1448 0 0)` ≈ #0a0a0a | Page background |
| `--foreground` | `oklch(0.2046 0 0)` ≈ #171717 | `oklch(0.9491 0 0)` ≈ #ededed | Primary text |
| `--primary` | `oklch(0.62 0.15 155)` green | `oklch(0.75 0.15 155)` green | **The accent.** Logo `.dev`, active dots, bullet dashes, counts, hover borders/links |
| `--card` / `--muted` / `--accent` | `oklch(0.9702 0 0)` ≈ #f5f5f5 | `oklch(0.1913 0 0)` ≈ #141414 | Row hover surface (`hover:bg-card`) |
| `--muted-foreground` | `oklch(0.5324 0 0)` ≈ #6f6f6f | `oklch(0.6432 0 0)` ≈ #8f8f8f | Secondary text, labels, icons |
| `--border` / `--input` | `oklch(0.9219 0 0)` ≈ #e4e4e4 | `oklch(0.2504 0 0)` ≈ #242424 | All hairlines, tiles, pills |
| `--ring` | green (as `--primary`) | green | Focus rings |
| `--stripe` | `rgb(0 0 0 / 4.5%)` | `rgb(255 255 255 / 5%)` | Diagonal stripe motif (custom token) |

**Accent discipline:** green is used only in small doses — a dot, a dash, a count, a hover state. Never as a fill for large surfaces. Destructive red exists but has no role on the landing page.

## Tokens — Typography

Geist + Geist Mono via `next/font` in `layout.tsx` (`--font-sans`, `--font-geist-mono` → mapped to `font-sans` / `font-mono`).

| Role | Style |
|------|-------|
| Page title (h1) | `text-3xl font-semibold tracking-[-0.02em]` |
| Section heading (h2) | **mono micro-label**: `font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground` (`SectionLabel`) |
| Body / about | `text-[14.5px] leading-[1.65] text-pretty` |
| Card title | `text-[17px] font-semibold tracking-[-0.01em]` |
| Secondary lines | `text-[13px]`–`text-[13.5px] text-muted-foreground` |
| Metadata (dates, periods, ©, footer values) | `font-mono text-[10px]–text-[13px]`, labels uppercase `tracking-[0.08em]` |

Rule of thumb: **anything that reads like data — labels, dates, tags, counts, the wordmark — is Geist Mono; anything that reads like prose is Geist.**

## Layout

- **The rail:** every stripe of content is `Container` — `max-w-[692px] mx-auto border-x border-border`. Nothing renders outside it except the stripe bands' background.
- **Sections:** full-width `<section>` with `border-b border-border` wrapping a `Container` (`Section` component). Content padding is `p-6` (24px); dense rows use `py-3.5 px-6`.
- **Stripe bands** (`StripeBand`): 36px-tall seams filled with the stripe motif `repeating-linear-gradient(-45deg, var(--stripe) 0 1px, transparent 1px 6px)` (utility `bg-stripes`). Solid variant paints the rail interior `bg-background` so stripes show only in the gutters; the pre-footer band is transparent. Page opens with one, closes with one (holding `BackToTop`).
- **Header:** sticky, 52px tall, `bg-background/85 backdrop-blur-sm`, hairline bottom border.
- Internal grid columns are split by hairline `border-r` (facts grid, footer cells), collapsing to stacked columns on mobile (`sm:` prefixes).

## Shapes & Radii

| Element | Radius |
|---------|--------|
| Pills, badges, theme toggle | `rounded-full` |
| Small icon tiles (30px, `IconTile sm`) | `rounded-md` |
| Social tiles (44px, `IconTile lg`), blog covers, back-to-top | `rounded-md` / `rounded-lg` |
| Project logo tiles (44px) | `rounded-xl` |

Borders are always 1px `border-border`. Elevation is nearly flat: `shadow-xs` on 44px tiles only. Empty image areas (logo placeholders, blog covers) show the `bg-stripes` motif, never a gray box.

## Reusable Components

Primitives in `src/components/common/` (all exported via barrel):

- **`Container`** — the 692px bordered rail.
- **`Section`** — `border-b` section wrapping a `Container`; takes `id` for anchor nav.
- **`StripeBand`** — the 36px seam; props `solid` (paint rail interior) and `bordered`.
- **`SectionLabel`** — uppercase mono h2, optionally with a green count: `Projects <span className="text-primary">(6)</span>`.
- **`Pill`** — `rounded-full` bordered chip; variants: `tag` (mono 11px, muted — tech tags), `meta` (mono 11.5px, fg — status, may contain a 6px green dot when active), `item` (sans 12.5px — stack items).
- **`IconTile`** — bordered square icon frame; `sm` 30px (fact rows), `lg` 44px + shadow (social links, also used as link class via `iconTileVariants`).
- **`ThemeToggle`**, **`LocalTime`**, **`BackToTop`** — the only client components; leaves only.

Brand SVGs (X, GitHub, LinkedIn) live in `src/components/icons/`; everything else uses lucide at 15–19px, `stroke-width` 2. Landing sections compose these from `src/components/landing/`; page data lives in `src/lib/content.ts`.

## Interaction

- Hovers are **color transitions only** (`transition-colors`) — no scale, no shadow growth, no motion.
- Rows (project cards, blog rows) hover to `bg-card`.
- Bordered controls hover to `border-primary text-primary` (tiles) or `border-muted-foreground` (theme toggle).
- Nav links: `text-muted-foreground → text-foreground`.
- Prose links use the `.link` class: underlined with `decoration-border`, `underline-offset-[3px]`, hover `text-primary decoration-primary`.
- Anchor navigation and back-to-top scroll smoothly (`scroll-smooth` on `<html>`).

## Do's and Don'ts

### Do
- Keep every piece of content inside `Container`/`Section` — the rail is the page.
- Use `SectionLabel` for every section heading; mono for every data-like string.
- Use `Pill`/`IconTile` variants instead of restyling chips and tiles ad hoc.
- Use `bg-stripes` for empty/placeholder surfaces and structural seams.
- Use `cn()` for className merging; semantic tokens for every color.

### Don't
- Don't introduce a second accent color — green (`--primary`) is the only chroma.
- Don't use filled buttons or heavy shadows; controls are 1px-bordered and flat.
- Don't hardcode hex/rgb or pixel radii — tokens only (`--stripe` included).
- Don't mark pages or sections `'use client'` — interactivity stays in the three client leaves.
- Don't let content escape the 692px rail or skip the hairline separators.

## Surfaces

| Level | Token | Purpose |
|-------|-------|---------|
| 0 | `--background` | Page + rail interior |
| 0b | `--stripe` on 0 | Seams, gutters, placeholders |
| 1 | `--card` | Row hover state |

There is no elevated surface hierarchy — structure comes from borders, not shadows.

## Quick Start

Rebrand by editing `:root` / `.dark` in `src/app/globals.css` and the tables above together. The accent is `--primary` (+ `--ring`); the stripe motif is `--stripe` + the `bg-stripes` utility; everything else follows the standard shadcn token names, so shadcn/ui components added later (`pnpm dlx shadcn@latest add <component>`) inherit the theme automatically.
