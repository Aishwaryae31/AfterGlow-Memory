"use client";

import { motion } from "framer-motion";
import { Image, Mic, Sparkles, Type, Video } from "lucide-react";

import { GlassCard } from "@/components/glass/glass-card";
import { memoryCardDrift } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { MemoryKind, MemoryStats } from "@/types/memory";

const icons: Record<MemoryKind, typeof Image> = {
  photo: Image,
  video: Video,
  voice: Mic,
  text: Type,
};

export function DashboardStatsRow({
  stats,
  reducedMotion,
}: {
  stats: MemoryStats | null;
  reducedMotion: boolean;
}) {
  if (!stats) return null;
  const items: { label: string; value: string; sub?: string; tone: "rose" | "lilac" | "default" }[] = [
    { label: "Total memories", value: String(stats.total), tone: "rose" },
    { label: "This month", value: String(stats.thisMonth), tone: "lilac" },
    { label: "Photos", value: String(stats.byKind.photo), sub: "still frames", tone: "default" },
    { label: "Voice notes", value: String(stats.byKind.voice), sub: "soft audio", tone: "default" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          {...(!reducedMotion
            ? { variants: memoryCardDrift(i), animate: "animate" as const }
            : {})}
        >
          <GlassCard
            tone={item.tone === "default" ? "default" : item.tone}
            className={cn(
              "relative overflow-hidden p-6 shadow-lift",
              i % 2 === 0 ? "-rotate-1" : "rotate-1",
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Glow
              </span>
            </div>
            <p className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{item.label}</p>
            {item.sub ? (
              <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
            ) : null}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

export function KindBreakdown({ stats }: { stats: MemoryStats | null }) {
  if (!stats) return null;
  const rows: { kind: MemoryKind; label: string }[] = [
    { kind: "photo", label: "Photos" },
    { kind: "video", label: "Videos" },
    { kind: "voice", label: "Voice" },
    { kind: "text", label: "Text" },
  ];
  return (
    <GlassCard className="space-y-4 rounded-scrapbook p-6 shadow-glass">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
        Archive mix
      </p>
      <ul className="space-y-3">
        {rows.map((row) => {
          const Icon = icons[row.kind];
          return (
            <li
              key={row.kind}
              className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary/20 bg-white/30 px-3 py-2 text-sm dark:bg-white/5"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                {row.label}
              </span>
              <span className="font-display text-lg font-semibold text-foreground">
                {stats.byKind[row.kind]}
              </span>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
