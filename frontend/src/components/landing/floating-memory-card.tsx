"use client";

import { motion } from "framer-motion";

import { memoryCardDrift } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

export type MemoryCardData = {
  id: string;
  title: string;
  caption: string;
  date: string;
  accent: "rose" | "cream" | "lilac";
  rotation: string;
  className?: string;
};

const accents: Record<MemoryCardData["accent"], string> = {
  rose: "from-blush-200/90 to-blush-400/50",
  cream: "from-amber-50/95 to-orange-100/60",
  lilac: "from-violet-100/90 to-fuchsia-100/55",
};

export function FloatingMemoryCard({
  memory,
  index,
  reducedMotion,
}: {
  memory: MemoryCardData;
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      {...(!reducedMotion
        ? { variants: memoryCardDrift(index), animate: "animate" as const }
        : {})}
      className={cn(
        "pointer-events-none absolute w-[min(100%,220px)] select-none sm:w-[240px]",
        memory.className,
      )}
      style={{ rotate: memory.rotation }}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-sm bg-white/95 p-2 pb-10 shadow-lift ring-1 ring-black/5 dark:bg-zinc-900/90 dark:ring-white/10",
        )}
      >
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-[2px] bg-gradient-to-br shadow-inner",
            accents[memory.accent],
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_55%)] opacity-80 mix-blend-soft-light dark:opacity-40" />
          <div className="absolute inset-x-3 top-3 h-1.5 rounded-full bg-white/55 shadow-sm backdrop-blur-sm dark:bg-white/15" />
          <p className="absolute bottom-3 left-3 right-3 font-display text-lg font-medium italic leading-snug tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] dark:text-white/95">
            {memory.title}
          </p>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="line-clamp-2 font-medium leading-tight text-foreground/80">
            {memory.caption}
          </span>
          <span className="shrink-0 rounded-full bg-muted/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {memory.date}
          </span>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-1 top-6 h-8 w-3 rotate-[-8deg] rounded-sm bg-blush-200/80 shadow-sm dark:bg-blush-800/50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1 top-10 h-7 w-3 rotate-[6deg] rounded-sm bg-amber-100/90 shadow-sm dark:bg-amber-900/40"
        />
      </div>
    </motion.article>
  );
}
