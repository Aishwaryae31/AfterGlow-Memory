"use client";

import { motion } from "framer-motion";
import { CalendarHeart, Heart, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { fadeUpItem, fadeUpStagger, scrollReveal } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type {
  MemoryInsights,
  MemoryRecord,
  MemoryStreak,
} from "@/types/memory";

export function RecentMemoriesSection({
  memories,
  onDeleted,
}: {
  memories: MemoryRecord[];
  onDeleted: () => void;
}) {
  const [pending, setPending] = React.useState<string | null>(null);

  async function remove(id: string) {
    setPending(id);
    try {
      await fetch(`/api/memories/${id}`, { method: "DELETE", cache: "no-store" });
      onDeleted();
    } finally {
      setPending(null);
    }
  }

  if (!memories.length) {
    return (
      <GlassCard className="rounded-scrapbook border-dashed border-primary/25 p-10 text-center shadow-lift">
        <p className="font-display text-2xl font-semibold italic text-foreground">
          Your desk is waiting for its first polaroid.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Drop a photo, a whispered voice note, or a paragraph you never want to
          forget — Afterglow will keep it in blush light.
        </p>
      </GlassCard>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={scrollReveal}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Recent
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Fresh from your heart&apos;s darkroom
          </h2>
        </div>
      </div>
      <motion.ul
        variants={fadeUpStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-4 md:grid-cols-2"
      >
        {memories.map((m) => (
          <motion.li key={m.id} variants={fadeUpItem}>
            <GlassCard
              tone="rose"
              className={cn(
                "group relative overflow-hidden p-5 shadow-lift transition-shadow hover:shadow-glass",
                "rotate-1 odd:-rotate-1",
              )}
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/50 bg-muted/40 shadow-inner dark:border-white/10">
                  {m.media?.secureUrl && m.kind !== "voice" ? (
                    <Image
                      src={m.media.secureUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      {m.kind}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-display text-lg font-semibold text-foreground">
                    {m.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {m.description || m.content || "—"}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {new Date(m.memoryDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete memory"
                disabled={pending === m.id}
                onClick={() => void remove(m.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </GlassCard>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}

export function OnThisDayCard({ memories }: { memories: MemoryRecord[] }) {
  return (
    <GlassCard tone="lilac" className="space-y-4 rounded-scrapbook p-6 shadow-lift">
      <div className="flex items-center gap-2">
        <CalendarHeart className="h-5 w-5 text-primary" aria-hidden />
        <h3 className="font-display text-xl font-semibold text-foreground">
          On this day
        </h3>
      </div>
      {!memories.length ? (
        <p className="text-sm text-muted-foreground">
          No echoes for today yet — the calendar is still breathing in.
        </p>
      ) : (
        <ul className="space-y-3">
          {memories.slice(0, 4).map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-dashed border-primary/20 bg-white/35 px-3 py-2 text-sm dark:bg-white/5"
            >
              <span className="font-medium text-foreground">{m.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {new Date(m.memoryDate).getFullYear()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

export function InsightsCard({ insights }: { insights: MemoryInsights | null }) {
  if (!insights) return null;
  return (
    <GlassCard className="space-y-4 rounded-scrapbook p-6 shadow-lift">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" aria-hidden />
        <h3 className="font-display text-xl font-semibold text-foreground">
          Emotional weather
        </h3>
      </div>
      <p className="text-sm italic leading-relaxed text-muted-foreground">
        {insights.whisper}
      </p>
      <div className="flex flex-wrap gap-2">
        {insights.topEmotions.map((e) => (
          <span
            key={e.label}
            className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
          >
            {e.label} · {e.count}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

export function StreakCard({ streak }: { streak: MemoryStreak | null }) {
  if (!streak) return null;
  return (
    <GlassCard tone="rose" className="space-y-3 rounded-scrapbook p-6 shadow-lift">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden />
        <h3 className="font-display text-xl font-semibold text-foreground">
          Gentle streak
        </h3>
      </div>
      <p className="font-display text-4xl font-semibold text-primary">
        {streak.streak}{" "}
        <span className="text-lg font-medium text-muted-foreground">days</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Consecutive days with a memory anchored on your calendar (
        {streak.daysWithMemories} unique days in view).
      </p>
    </GlassCard>
  );
}
