/**
 * Shared design tokens for programmatic use (charts, canvas, emails).
 * Visual source of truth remains CSS variables in `src/app/globals.css`.
 */
export const afterglowTokens = {
  radii: {
    card: "1rem",
    pill: "9999px",
    scrapbook: "1.25rem 0.85rem 1.35rem 0.9rem",
  },
  motion: {
    page: { durationMs: 650, ease: [0.22, 1, 0.36, 1] as const },
    staggerChildren: 0.12,
  },
  glass: {
    blur: "18px",
  },
} as const;
