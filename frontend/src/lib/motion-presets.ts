import type { Variants, Transition } from "framer-motion";

const softSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.9,
};

const gentleEase: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

/** Staggered fade-up for hero sections and scrapbook stacks */
export const fadeUpStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: gentleEase,
  },
};

/** Page enter — subtle drift like turning a page */
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...gentleEase, duration: 0.65 },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

/** Glass cards — lift on hover without harsh motion */
export const glassHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: softSpring,
  },
  tap: { scale: 0.98, transition: { duration: 0.15 } },
};

/** Ambient float for decorative blooms / polaroids */
export const floatSlow: Variants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 1.5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Drawer / sheet feel */
export const slideFromBottom: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: softSpring,
  },
};

export const reducedMotionFallback: Transition = {
  duration: 0.01,
};

/** Scroll-driven section reveals */
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...gentleEase, duration: 0.65 },
  },
};

export const scrollRevealWide: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleEase,
  },
};

/** Hero headline — per-line drift */
export const heroLine: Variants = {
  hidden: { opacity: 0, y: 36, skewY: 2 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Slow ambient orbs behind the hero */
export const heroOrbPulse: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.45, 0.65, 0.45],
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" },
  },
};

/** Offset pulse so layered orbs do not move in lockstep */
export const heroOrbPulseOffset: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.38, 0.58, 0.38],
    transition: {
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2.2,
    },
  },
};

export function memoryCardDrift(index: number): Variants {
  const duration = 7 + index * 0.9;
  return {
    animate: {
      y: [0, -10 - index * 2, 0],
      rotate: [0, 1.2 + index * 0.4, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.35,
      },
    },
  };
}
