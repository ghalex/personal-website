import { Link2, Mail } from "lucide-react";

import { iconTileVariants, Section } from "@/components/common";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const socials = [
  { title: "X / Twitter", href: "https://x.com/ghalex", icon: <XIcon size={19} /> },
  { title: "GitHub", href: "https://github.com/ghalex", icon: <GithubIcon size={20} /> },
  {
    title: "LinkedIn",
    href: "https://linkedin.com/in/ghalex",
    icon: <LinkedinIcon size={18} />,
  },
  { title: "logzai.com", href: "https://logzai.com", icon: <Link2 className="size-[19px]" /> },
  { title: "Email", href: `mailto:${site.email}`, icon: <Mail className="size-[19px]" /> },
];

export function SocialLinks() {
  return (
    <Section className="flex flex-wrap items-center gap-2.5 px-6 py-3.5">
      {socials.map((social) => (
        <a
          key={social.title}
          href={social.href}
          title={social.title}
          aria-label={social.title}
          className={cn(
            iconTileVariants({ size: "lg" }),
            "text-foreground transition-colors hover:border-primary hover:text-primary",
          )}
        >
          {social.icon}
        </a>
      ))}
    </Section>
  );
}
