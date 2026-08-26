/** 4px base grid. Use these values only — no arbitrary spacing. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

/** Horizontal gutter on every screen. Keep edits here — never per-screen. */
export const screenPadding = spacing.lg;
