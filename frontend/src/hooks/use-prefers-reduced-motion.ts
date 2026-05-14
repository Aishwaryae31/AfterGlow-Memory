"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Single hook for respecting OS reduced-motion across Framer presets.
 */
export function usePrefersReducedMotion() {
  return useFramerReducedMotion();
}
