import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const iconTileVariants = cva(
  "flex shrink-0 items-center justify-center border border-border",
  {
    variants: {
      size: {
        sm: "size-[30px] rounded-md",
        lg: "size-11 rounded-lg bg-background shadow-xs",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

type IconTileProps = {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof iconTileVariants>;

export function IconTile({ children, size, className }: IconTileProps) {
  return <span className={cn(iconTileVariants({ size }), className)}>{children}</span>;
}
