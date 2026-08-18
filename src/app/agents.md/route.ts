import { about, projects, site, stack } from "@/lib/content";
import { isPublished, posts } from "@/lib/posts";

export const dynamic = "force-static";

const projectSection = (p: (typeof projects)[number]) =>
  [
    `### ${p.name} — ${p.role}`,
    "",
    `- URL: ${p.url}`,
    `- Status: ${p.meta}${p.active && p.meta !== "active" ? " (active)" : ""}`,
    ...p.bullets.map((b) => `- ${b}`),
    `- Tech: ${p.tags.join(", ")}`,
  ].join("\n");

export function GET() {
  const md = [
    `# ${site.name} (@${site.handle})`,
    "",
    `> ${site.tagline}`,
    "",
    `${site.description} Based in ${site.location} (GMT+3). Shipping software since ${site.shippingSince}.`,
    "",
    `- Website: https://${site.domain}`,
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    `- X / Twitter: ${site.x}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Now building: ${site.zenve3d} and ${site.llmbrain}`,
    "",
    "## About",
    "",
    about.join("\n\n"),
    "",
    "## Projects",
    "",
    projects.map(projectSection).join("\n\n"),
    "",
    "## Stack",
    "",
    stack.map((g) => `- **${g.name}**: ${g.items.join(", ")}`).join("\n"),
    "",
    "## Writing",
    "",
    posts
      .filter(isPublished)
      .map(
        (p) =>
          `- [${p.title}](https://${site.domain}/blog/${p.slug}) — ${p.description} (${p.date}, ${p.readingTime} min read)`,
      )
      .join("\n"),
    "",
    `*Generated from the content of https://${site.domain} — the landing page and this file always match.*`,
    "",
  ].join("\n");

  return new Response(md, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
