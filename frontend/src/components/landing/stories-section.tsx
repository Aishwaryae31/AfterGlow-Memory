"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { GlassCard } from "@/components/glass/glass-card";
import { scrollRevealWide, staggerChildren, staggerItem } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const stories = [
  {
    quote:
      "It feels like opening a jewelry box — every memory cushioned in velvet light.",
    name: "Nora",
    context: "Archiving her grandmother's letters",
  },
  {
    quote:
      "The gradients alone slow me down in the best way. I finally sat with photos I had ignored for years.",
    name: "Ellis",
    context: "Parent, 35mm scans",
  },
  {
    quote:
      "Afterglow doesn't rush me to 'organize.' It invites me to stay inside the feeling a little longer.",
    name: "Mika",
    context: "Long-distance relationship timeline",
  },
];

export function StoriesSection() {
  return (
    <section id="stories" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-90px" }}
          variants={scrollRevealWide}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Field notes
          </p>
          <h2 className="mt-4 font-display text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.65rem] md:leading-tight">
            Voices from the first{" "}
            <span className="italic text-primary">glowkeepers</span>.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerChildren}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {stories.map((story, i) => (
            <motion.div key={story.name} variants={staggerItem}>
              <GlassCard
                tone={i === 1 ? "lilac" : "rose"}
                className={cn(
                  "relative flex h-full flex-col gap-4 p-7 sm:p-8",
                  i === 0 && "-rotate-1",
                  i === 1 && "translate-y-2 rotate-1 md:-translate-y-2",
                  i === 2 && "-rotate-1 md:rotate-1",
                )}
              >
                <Quote
                  className="h-8 w-8 text-primary/70"
                  aria-hidden
                  strokeWidth={1.25}
                />
                <p className="font-display text-lg leading-relaxed text-foreground sm:text-xl">
                  “{story.quote}”
                </p>
                <div className="mt-auto border-t border-dashed border-primary/20 pt-4 text-sm">
                  <p className="font-medium text-foreground">{story.name}</p>
                  <p className="text-muted-foreground">{story.context}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
