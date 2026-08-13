import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";

type StripeBandProps = {
  solid?: boolean;
  bordered?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function StripeBand({
  solid = true,
  bordered = true,
  children,
  className,
}: StripeBandProps) {
  return (
    <div
      className={cn("h-9 bg-stripes", bordered && "border-b border-border", className)}
    >
      <Container className={cn("h-full", solid && "bg-background")}>
        {children}
      </Container>
    </div>
  );
}
