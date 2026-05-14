"use client";

import { motion } from "framer-motion";

export function DashboardAmbient() {
  return (
    <>
      <motion.div
        aria-hidden
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed -left-40 top-24 -z-10 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-primary/45 via-blush-200/35 to-transparent blur-3xl dark:from-primary/25 dark:via-blush-900/20"
      />
      <motion.div
        aria-hidden
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.28, 0.48, 0.28],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none fixed -right-32 bottom-10 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-tl from-fuchsia-200/45 via-blush-100/25 to-transparent blur-3xl dark:from-fuchsia-900/25 dark:via-blush-900/15"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-blush-100/35 via-transparent to-background dark:from-blush-950/25"
      />
    </>
  );
}
