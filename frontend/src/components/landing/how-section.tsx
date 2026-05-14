"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { scrollReveal, staggerChildren, staggerItem } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Gather the fragments",
    body: "Import albums, voice memos, or paste a paragraph from an old diary — messy is beautiful here.",
  },
  {
    step: "02",
    title: "Let the glow arrange",
    body: "Afterglow finds echoes across time: the same smile, the same street, the same song in the background.",
  },
  {
    step: "03",
    title: "Hold the finished chapter",
    body: "Export a cinematic timeline, a printable scrapbook, or a private link only your favorite people can open.",
  },
];

export function HowSection() {
  return (
    <section id="how" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blush-50/40 to-transparent dark:via-blush-950/20" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={scrollReveal}
            className="lg:sticky lg:top-28"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-4 font-display text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Three quiet beats — like folding a letter into an envelope.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              No dashboards that shout. No sterile grids. Just a path from raw
              memory to something you want to linger inside.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-8 rounded-full border-primary/30 bg-white/30 backdrop-blur-md dark:bg-white/5"
            >
              <Link href="#join">Reserve early access</Link>
            </Button>
          </motion.div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerChildren}
            className="relative space-y-8"
          >
            <div
              aria-hidden
              className="absolute left-[1.35rem] top-6 bottom-6 hidden w-px bg-gradient-to-b from-primary/40 via-blush-300/50 to-transparent md:block dark:from-primary/30 dark:via-blush-800/40"
            />
            {steps.map((item, i) => (
              <motion.li
                key={item.step}
                variants={staggerItem}
                className={cn(
                  "relative rounded-scrapbook border border-dashed border-primary/25 bg-[var(--glass-bg)]/80 p-6 shadow-glass backdrop-blur-[var(--glass-blur)] sm:p-8",
                  i % 2 === 0 ? "-rotate-1" : "rotate-1",
                )}
              >
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-white/60 text-sm font-semibold text-primary shadow-tape dark:bg-white/10">
                    {item.step}
                  </span>
                  <span
                    aria-hidden
                    className="h-2 flex-1 max-w-[6rem] rounded-full bg-gradient-to-r from-blush-200 to-transparent"
                  />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.body}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
