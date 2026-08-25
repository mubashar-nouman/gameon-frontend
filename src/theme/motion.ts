/**
 * Motion tokens. DESIGN.md §8: subtle only, 200–350ms, no springs on
 * functional UI. Splash/onboarding is the documented exception.
 */
export const duration = {
  fast: 200,
  normal: 260,
  slow: 340,
} as const;

/** Bezier control points, spread into Easing.bezier(...). */
export const easing = {
  /** Standard ease-out for enter/exit and state changes. */
  standard: [0.22, 1, 0.36, 1] as const,
  /** Symmetric ease-in-out for continuous moves. */
  inOut: [0.4, 0, 0.2, 1] as const,
};

/** Distance for enter transitions — §8 caps translate at 8–16px. */
export const translate = {
  enter: 12,
} as const;
