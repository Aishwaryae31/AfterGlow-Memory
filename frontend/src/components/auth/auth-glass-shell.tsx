"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { FloatingParticles } from "@/components/auth/floating-particles";
import { fadeUpItem, fadeUpStagger, pageEnter } from "@/lib/motion-presets";

export function AuthGlassShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-blush-100/55 via-background to-background dark:from-blush-950/35"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-primary/45 via-blush-200/35 to-transparent blur-3xl dark:from-primary/25 dark:via-blush-900/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-gradient-to-tl from-fuchsia-200/45 via-blush-100/25 to-transparent blur-3xl dark:from-fuchsia-900/25 dark:via-blush-900/15"
      />

      <FloatingParticles className="z-0" />

      <motion.div
        variants={pageEnter}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-md"
      >
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[var(--glass-bg)] shadow-glass backdrop-blur-[var(--glass-blur)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <span className="bg-gradient-to-r from-blush-500 via-primary to-blush-700 bg-clip-text text-transparent">
            Afterglow
          </span>
        </Link>

        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={fadeUpItem} className="space-y-3 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              {subtitle}
            </p>
            <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
          </motion.div>

          <motion.div variants={fadeUpItem}>{children}</motion.div>

          {footer ? (
            <motion.div variants={fadeUpItem} className="text-center text-sm sm:text-left">
              {footer}
            </motion.div>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}
