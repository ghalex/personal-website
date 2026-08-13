import { Clock, Code, Globe, Mail, MapPin, Package } from "lucide-react";

import { IconTile, LocalTime, Section } from "@/components/common";
import { site } from "@/lib/content";

export function QuickFacts() {
  const renderFact = (icon: React.ReactNode, content: React.ReactNode) => (
    <span className="flex items-center gap-3">
      <IconTile size="sm" className="text-muted-foreground">
        {icon}
      </IconTile>
      <span>{content}</span>
    </span>
  );

  return (
    <Section className="grid grid-cols-1 text-[13.5px] sm:grid-cols-2">
      <div className="flex flex-col gap-2.5 border-b border-border px-6 py-3.5 sm:border-r sm:border-b-0">
        {renderFact(
          <Code className="size-[15px]" />,
          <>
            Founder @
            <a href={site.logzai} className="link">
              LogzAI
            </a>
          </>,
        )}
        {renderFact(
          <Package className="size-[15px]" />,
          <>
            Founder @
            <a href={site.zenve3d} className="link">
              Zenve3d
            </a>
          </>,
        )}
        {renderFact(<MapPin className="size-[15px]" />, site.location)}
      </div>
      <div className="flex flex-col gap-2.5 px-6 py-3.5 text-muted-foreground">
        {renderFact(
          <Clock className="size-[15px]" />,
          <>
            <LocalTime /> <span className="text-border">{"//"}</span>{" "}
            {site.timeZoneLabel}
          </>,
        )}
        {renderFact(
          <Mail className="size-[15px]" />,
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>,
        )}
        {renderFact(<Globe className="size-[15px]" />, "20 years in software")}
      </div>
    </Section>
  );
}
