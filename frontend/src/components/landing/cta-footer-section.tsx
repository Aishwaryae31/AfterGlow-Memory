"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass/glass-card";
import { fadeUpItem, fadeUpStagger, scrollReveal } from "@/lib/motion-presets";

export function CtaFooterSection() {
  return (
    <footer id="join" className="relative scroll-mt-24 pb-16 pt-8 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scrollReveal}
        >
          <GlassCard className="relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-primary/40 via-blush-200/40 to-transparent blur-3xl dark:from-primary/25 dark:via-blush-900/30"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-fuchsia-200/50 to-transparent blur-3xl dark:from-fuchsia-900/25"
            />

            <motion.div
              variants={fadeUpStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="relative z-10 mx-auto max-w-2xl text-center"
            >
              <motion.p
                variants={fadeUpItem}
                className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground"
              >
                Join the waitlist
              </motion.p>
              <motion.h2
                variants={fadeUpItem}
                className="mt-4 font-display text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-tight"
              >
                Let your next chapter settle into something{" "}
                <span className="italic text-primary">permanent & pink</span>.
              </motion.h2>
              <motion.p
                variants={fadeUpItem}
                className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg"
              >
                We are slowly opening the studio. Leave your email and we will
                send a handwritten note when your seat at the table is ready.
              </motion.p>
              <motion.div
                variants={fadeUpItem}
                className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
              >
                <Button asChild size="lg" className="rounded-full px-10 shadow-lift">
                  <Link href="#hero">Request invite</Link>
                </Button>
                <Button
                  asChild
                  variant="glass"
                  size="lg"
                  className="rounded-full px-10"
                >
                  <Link href="#features">Explore the studio</Link>
                </Button>
              </motion.div>
            </motion.div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-dashed border-primary/20 pt-8 text-center text-sm text-muted-foreground sm:flex-row sm:text-left"
        >
          <p>© {new Date().getFullYear()} Afterglow. Crafted for soft light.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#stories"
              className="transition-colors hover:text-foreground"
            >
              Stories
            </Link>
            <Link
              href="#how"
              className="transition-colors hover:text-foreground"
            >
              Process
            </Link>
            <Link
              href="#join"
              className="transition-colors hover:text-foreground"
            >
              Waitlist
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
