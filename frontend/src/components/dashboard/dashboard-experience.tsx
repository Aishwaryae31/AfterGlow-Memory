"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { DashboardAmbient } from "@/components/dashboard/dashboard-ambient";
import {
  InsightsCard,
  OnThisDayCard,
  RecentMemoriesSection,
  StreakCard,
} from "@/components/dashboard/dashboard-sections";
import {
  DashboardStatsRow,
  KindBreakdown,
} from "@/components/dashboard/dashboard-stats";
import { MemoryUploadModal } from "@/components/dashboard/memory-upload-modal";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { afterglowJson } from "@/lib/dashboard-fetch";
import { fadeUpItem, fadeUpStagger, pageEnter } from "@/lib/motion-presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type {
  MemoryInsights,
  MemoryRecord,
  MemoryStats,
  MemoryStreak,
} from "@/types/memory";

type PublicUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

export function DashboardExperience({ user }: { user: PublicUser }) {
  const reducedMotion = usePrefersReducedMotion();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [stats, setStats] = React.useState<MemoryStats | null>(null);
  const [recent, setRecent] = React.useState<MemoryRecord[]>([]);
  const [onThisDay, setOnThisDay] = React.useState<MemoryRecord[]>([]);
  const [insights, setInsights] = React.useState<MemoryInsights | null>(null);
  const [streak, setStreak] = React.useState<MemoryStreak | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r, o, i, t] = await Promise.all([
        afterglowJson<MemoryStats>("/api/memories/stats"),
        afterglowJson<{ memories: MemoryRecord[] }>("/api/memories?limit=8"),
        afterglowJson<{ memories: MemoryRecord[] }>("/api/memories/on-this-day"),
        afterglowJson<MemoryInsights>("/api/memories/insights"),
        afterglowJson<MemoryStreak>("/api/memories/streak"),
      ]);
      setStats(s);
      setRecent(r.memories);
      setOnThisDay(o.memories);
      setInsights(i);
      setStreak(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your studio.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const greeting =
    user.name?.trim().split(/\s+/)[0] ??
    user.email.split("@")[0] ??
    "friend";

  return (
    <>
      <DashboardAmbient />
      <motion.div
        variants={pageEnter}
        initial="initial"
        animate="animate"
        className="relative z-10 mx-auto max-w-6xl space-y-12 px-4 pb-24 pt-28 sm:px-6 lg:px-8"
      >
        <motion.section
          variants={fadeUpStagger}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={fadeUpItem} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Your studio
            </p>
            <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-tight">
              {greeting}, the light still remembers you.
            </h1>
            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Scatter new fragments, revisit old ones, and let the hush of baby
              pink gradients hold everything tenderly.
            </p>
          </motion.div>

          <motion.div variants={fadeUpItem} className="flex flex-wrap gap-3">
            <Button
              type="button"
              size="lg"
              className="rounded-full px-8 shadow-lift"
              onClick={() => setModalOpen(true)}
            >
              Upload a memory
            </Button>
            <Button asChild variant="glass" size="lg" className="rounded-full px-8">
              <Link href="/">Return home</Link>
            </Button>
          </motion.div>
        </motion.section>

        {error ? (
          <GlassCard className="border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </GlassCard>
        ) : null}

        {loading ? (
          <p className="text-center text-sm text-muted-foreground">
            Unfurling ribbons from your archive…
          </p>
        ) : null}

        <DashboardStatsRow stats={stats} reducedMotion={!!reducedMotion} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <RecentMemoriesSection memories={recent} onDeleted={load} />
            <KindBreakdown stats={stats} />
          </div>
          <div className="space-y-6">
            <OnThisDayCard memories={onThisDay} />
            <InsightsCard insights={insights} />
            <StreakCard streak={streak} />
            <GlassCard className="rounded-scrapbook bg-gradient-to-br from-blush-100/50 to-transparent p-6 text-sm shadow-lift dark:from-blush-950/40">
              <p className="font-display text-lg font-semibold text-foreground">
                A quiet invitation
              </p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                The most precious archives grow slowly — one polaroid edge, one
                voice note, one line of poetry at a time.
              </p>
              <Button
                type="button"
                className="mt-4 w-full rounded-full"
                onClick={() => setModalOpen(true)}
              >
                Begin an upload
              </Button>
            </GlassCard>
          </div>
        </div>
      </motion.div>

      <MemoryUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => void load()}
      />
    </>
  );
}
