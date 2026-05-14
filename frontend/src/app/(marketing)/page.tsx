"use client";

import { motion } from "framer-motion";

import {
  CtaFooterSection,
  FeaturesSection,
  HeroSection,
  HowSection,
  MemoriesStripSection,
  StoriesSection,
} from "@/components/landing";
import { pageEnter } from "@/lib/motion-presets";

export default function HomePage() {
  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="flex flex-1 flex-col"
    >
      <HeroSection />
      <FeaturesSection />
      <HowSection />
      <MemoriesStripSection />
      <StoriesSection />
      <CtaFooterSection />
    </motion.div>
  );
}
