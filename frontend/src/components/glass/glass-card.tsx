import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  [
    "relative overflow-hidden rounded-2xl border",
    "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
    "border-[color:var(--glass-border)]",
    "shadow-glass",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-gradient-to-br before:to-transparent before:opacity-80",
  ],
  {
    variants: {
      tone: {
        default: "before:from-[var(--glass-highlight)]",
        rose: "before:from-blush-200/40 before:via-blush-100/20 dark:before:from-blush-900/35",
        lilac:
          "before:from-purple-200/35 before:via-purple-100/15 dark:before:from-purple-900/25",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

export function GlassCard({ className, tone, ...props }: GlassCardProps) {
  return (
    <div className={cn(glassCardVariants({ tone }), className)} {...props} />
  );
}
