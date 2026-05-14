"use client";

import { motion } from "framer-motion";
import { Heart, Mic, Sparkles, Wand2 } from "lucide-react";

import { GlassCard } from "@/components/glass/glass-card";
import { scrollReveal, staggerChildren, staggerItem } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Gentle ingestion",
    body: "Drop in photos, audio letters, and stray thoughts — Afterglow listens for the emotional thread between them.",
    icon: Mic,
    tone: "rose" as const,
    tilt: "-rotate-1",
  },
  {
    title: "Cinematic recall",
    body: "Stories surface like scenes: soft fades, blush light leaks, and typography that feels whispered, not shouted.",
    icon: Sparkles,
    tone: "lilac" as const,
    tilt: "rotate-1",
  },
  {
    title: "Scrapbook structure",
    body: "Chapters, polaroid stacks, and washi-tape labels keep everything human — never sterile, never cold.",
    icon: Heart,
    tone: "default" as const,
    tilt: "-rotate-1",
  },
  {
    title: "AI as curator",
    body: "Models suggest pairings and gentle summaries, but you always choose what glows — privacy-first by design.",
    icon: Wand2,
    tone: "rose" as const,
    tilt: "rotate-1",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={scrollReveal}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            The studio
          </p>
          <h2 className="mt-4 font-display text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-tight">
            A{" "}
            <span className="italic text-primary">
              scrapbook-soft
            </span>{" "}
            workspace for the heart&apos;s archives.
          </h2>
          <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
            Every surface is glassy, every gradient is blush-warm, every motion
            is slow cinema — built for remembering, not scrolling.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerChildren}
          className="mt-16 grid gap-6 md:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={staggerItem}>
              <GlassCard
                tone={feature.tone}
                className={cn(
                  "group h-full p-8 transition-shadow duration-500 hover:shadow-lift",
                  feature.tilt,
                )}
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--glass-border)] bg-white/50 text-primary shadow-tape backdrop-blur-md dark:bg-white/5">
                    <feature.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="h-2 w-14 rounded-full bg-gradient-to-r from-blush-200 via-primary/60 to-transparent opacity-80" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {feature.body}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
