"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const PRESETS = [
  { className: "left-[8%] top-[18%] h-2 w-2", delay: 0, duration: 9 },
  { className: "left-[22%] top-[62%] h-1.5 w-1.5", delay: 0.6, duration: 11 },
  { className: "right-[12%] top-[24%] h-2 w-2", delay: 1.1, duration: 10 },
  { className: "right-[28%] top-[70%] h-1 w-1", delay: 0.2, duration: 12 },
  { className: "left-[45%] top-[12%] h-1.5 w-1.5", delay: 1.6, duration: 8 },
  { className: "left-[60%] bottom-[18%] h-2 w-2", delay: 0.9, duration: 10.5 },
  { className: "right-[40%] bottom-[26%] h-1 w-1", delay: 0.4, duration: 9.5 },
];

export function FloatingParticles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {PRESETS.map((p, i) => (
        <motion.span
          key={i}
          className={cn(
            "absolute rounded-full bg-gradient-to-br from-primary/55 to-blush-300/35 blur-[0.5px] shadow-[0_0_18px_rgba(255,150,190,0.35)] dark:from-primary/35 dark:to-blush-700/25",
            p.className,
          )}
          animate={{
            y: [0, -14, 0],
            x: [0, 6, 0],
            opacity: [0.25, 0.85, 0.25],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
