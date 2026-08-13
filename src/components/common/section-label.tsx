import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children?: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        "font-mono text-xs font-medium tracking-[0.08em] uppercase text-muted-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}
