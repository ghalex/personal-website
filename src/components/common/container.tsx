import { cn } from "@/lib/utils";

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-[692px] border-x border-border", className)}>
      {children}
    </div>
  );
}
