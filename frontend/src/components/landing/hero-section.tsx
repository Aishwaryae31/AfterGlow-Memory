"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  fadeUpItem,
  fadeUpStagger,
  heroLine,
  heroOrbPulse,
  heroOrbPulseOffset,
} from "@/lib/motion-presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

import {
  FloatingMemoryCard,
  type MemoryCardData,
} from "./floating-memory-card";

const memories: MemoryCardData[] = [
  {
    id: "1",
    title: "Golden hour on the pier",
    caption: "Salt air, soft laughter, the last warm frame of the day.",
    date: "Aug 04",
    accent: "rose",
    rotation: "-7deg",
    className: "right-[-4%] top-[8%] hidden lg:block",
  },
  {
    id: "2",
    title: "Sunday letters",
    caption: "Handwritten margins, coffee rings, little hearts in pencil.",
    date: "Sep 17",
    accent: "cream",
    rotation: "5deg",
    className: "right-[6%] top-[38%] hidden md:block",
  },
  {
    id: "3",
    title: "First snowfall",
    caption: "Quiet windows, breath on glass, a city turned to blush.",
    date: "Dec 01",
    accent: "lilac",
    rotation: "-4deg",
    className: "right-[-2%] bottom-[6%] hidden xl:block",
  },
];

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden scroll-mt-20 pt-24 pb-28 sm:pt-28 md:pb-36 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-blush-100/50 via-transparent to-transparent dark:from-blush-950/30"
      />
      <motion.div
        aria-hidden
        variants={reducedMotion ? undefined : heroOrbPulse}
        animate={reducedMotion ? undefined : "animate"}
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-primary/50 via-blush-200/40 to-transparent blur-3xl dark:from-primary/25 dark:via-blush-900/20"
      />
      <motion.div
        aria-hidden
        variants={reducedMotion ? undefined : heroOrbPulseOffset}
        animate={reducedMotion ? undefined : "animate"}
        className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-[380px] w-[380px] rounded-full bg-gradient-to-bl from-fuchsia-200/45 via-blush-100/30 to-transparent blur-3xl dark:from-fuchsia-900/25 dark:via-blush-900/15"
      />
      <motion.div
        aria-hidden
        variants={reducedMotion ? undefined : heroOrbPulse}
        animate={reducedMotion ? undefined : "animate"}
        className="pointer-events-none absolute bottom-[-10%] left-1/3 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-gradient-to-t from-rose-200/40 via-transparent to-transparent blur-3xl dark:from-rose-900/25"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:min-h-[min(78vh,820px)] lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex max-w-2xl flex-1 flex-col gap-8"
        >
          <motion.p
            variants={fadeUpItem}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground shadow-glass backdrop-blur-[var(--glass-blur)]"
          >
            AI memory preservation
          </motion.p>

          <div className="space-y-2">
            <motion.h1
              variants={heroLine}
              className="font-display text-balance text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.05] tracking-tight text-foreground"
            >
              Keep the feeling{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute -inset-x-1 -inset-y-1 -z-10 rotate-[-1.5deg] rounded-scrapbook bg-gradient-to-r from-blush-200/70 via-primary/35 to-blush-100/60 blur-[2px] dark:from-blush-900/50 dark:via-primary/25 dark:to-blush-950/40"
                />
                <span className="bg-gradient-to-r from-blush-600 via-primary to-blush-500 bg-clip-text italic text-transparent dark:from-blush-300 dark:via-primary dark:to-blush-200">
                  after the moment
                </span>
              </span>{" "}
              fades.
            </motion.h1>
            <motion.p
              variants={fadeUpItem}
              className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Afterglow turns scattered photos, voice notes, and fragments into
              a living scrapbook — gentle, cinematic, and yours forever in baby
              pink light.
            </motion.p>
          </div>

          <motion.div
            variants={fadeUpItem}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="rounded-full px-8 shadow-lift">
              <Link href="#join">Start your archive</Link>
            </Button>
            <Button
              asChild
              variant="glass"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href="#how">See how it works</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2" aria-hidden>
              {[
                { label: "A", className: "from-blush-300 to-blush-500 text-primary-foreground" },
                { label: "G", className: "from-amber-100 to-orange-200 text-foreground" },
                { label: "M", className: "from-violet-200 to-fuchsia-300 text-foreground" },
                { label: "+", className: "from-paper to-blush-100 text-foreground" },
              ].map((avatar) => (
                <span
                  key={avatar.label}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br text-[10px] font-semibold shadow-sm",
                    avatar.className,
                  )}
                >
                  {avatar.label}
                </span>
              ))}
            </div>
            <p className="max-w-[14rem] leading-snug">
              <span className="font-medium text-foreground">12k+</span> memories
              preserved in hushed, cinematic clarity.
            </p>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto flex h-[320px] w-full max-w-md flex-1 items-center justify-center sm:h-[380px] lg:mx-0 lg:h-[480px] lg:max-w-none">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center lg:justify-end">
            <div className="relative h-full w-full max-w-[420px] lg:max-w-[520px]">
              <div className="absolute inset-6 rounded-[2.5rem] border border-dashed border-primary/25 bg-gradient-to-br from-white/30 to-transparent shadow-inner backdrop-blur-sm dark:border-primary/15 dark:from-white/5" />
              {memories.map((memory, index) => (
                <FloatingMemoryCard
                  key={memory.id}
                  memory={memory}
                  index={index}
                  reducedMotion={!!reducedMotion}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 flex w-[88%] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-3xl border border-[color:var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-lift backdrop-blur-[var(--glass-blur)] md:hidden">
                <p className="font-display text-2xl font-medium italic leading-tight text-foreground">
                  Floating memories
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  On larger screens, polaroids drift beside your story — soft
                  motion, soft pink, like pages left open on a sunlit desk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="mx-auto mt-4 h-px max-w-6xl origin-left bg-gradient-to-r from-transparent via-primary/35 to-transparent px-8"
      />
    </section>
  );
}
