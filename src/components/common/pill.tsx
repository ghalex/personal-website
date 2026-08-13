import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-[7px] rounded-full border border-border",
  {
    variants: {
      variant: {
        tag: "px-2.5 py-1 font-mono text-[11px] text-muted-foreground bg-background",
        meta: "px-2.5 py-1 font-mono text-[11.5px] text-foreground",
        item: "px-2.5 py-1 text-[12.5px]",
      },
    },
    defaultVariants: {
      variant: "tag",
    },
  },
);

type PillProps = {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof pillVariants>;

export function Pill({ children, variant, className }: PillProps) {
  return <span className={cn(pillVariants({ variant }), className)}>{children}</span>;
}
