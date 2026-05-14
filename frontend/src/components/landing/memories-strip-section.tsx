"use client";

import { motion } from "framer-motion";

import { scrollReveal, staggerChildren, staggerItem } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const memories = [
  {
    label: "Polaroid rain",
    detail: "Stacks of instant film, scanned edges left imperfect on purpose.",
  },
  {
    label: "Voice blooms",
    detail: "Audio waves become soft petals hugging the transcript underneath.",
  },
  {
    label: "Date ribbons",
    detail: "Timelines tied with typographic ribbon — never clinical, always tender.",
  },
];

export function MemoriesStripSection() {
  return (
    <section
      id="memories"
      className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blush-100/50 to-transparent blur-2xl dark:from-blush-900/25" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scrollReveal}
          className="flex flex-col gap-4 text-center sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Memory motifs
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Details that feel lifted from a keepsake drawer.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerChildren}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {memories.map((item, i) => (
            <motion.article
              key={item.label}
              variants={staggerItem}
              className={cn(
                "min-w-[min(100%,280px)] snap-start rounded-scrapbook border border-[color:var(--glass-border)] bg-gradient-to-br from-white/70 to-blush-50/50 p-6 shadow-lift backdrop-blur-md dark:from-white/8 dark:to-blush-950/30 sm:min-w-[300px] sm:p-8",
                i % 2 === 1 ? "sm:translate-y-4" : "-rotate-1",
                i % 2 === 0 && "rotate-1",
              )}
            >
              <div className="mb-4 h-1.5 w-12 rounded-full bg-primary/70" />
              <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
