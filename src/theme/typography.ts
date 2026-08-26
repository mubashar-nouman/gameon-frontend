/**
 * Type scale for in-app UI. Playfair Display is reserved for splash/onboarding only.
 * Import font families from here — never invent sizes in screens.
 */
export const fontFamily = {
  /** Splash, onboarding, brand moments only */
  display: 'PlayfairDisplay_700Bold',
  /** All functional UI */
  ui: undefined as string | undefined,
} as const;

export const fontSize = {
  /** Badges, dot labels, dense metadata. */
  caption: 11,
  /** Secondary meta under a title; tab bar labels. */
  footnote: 13,
  /** Default body and list subtitles. */
  body: 14,
  /** Card titles, list row titles, button labels. */
  bodyLarge: 15,
  /** Prices and emphasised inline values. */
  callout: 16,
  /** Section headings within a screen. */
  sectionTitle: 17,
  /** Single large figure — a rating or count used as a visual anchor. */
  statHero: 32,
  /** The one large heading per screen. */
  screenTitle: 20,
  /** Emoji glyph inside sport tiles — a graphic, not body copy. */
  sportEmoji: 24,
  /** Splash / onboarding hero only — not for in-app screens */
  display: 36,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.5,
} as const;

/**
 * Line height in whole pixels. Two things clip descenders otherwise:
 * fractional values (13 * 1.4 = 18.2) round inconsistently across platforms,
 * and a ratio below ~1.5 leaves no room under the baseline at small sizes.
 * Defaults to the relaxed ratio for that reason.
 */
export function leading(
  size: number,
  ratio: number = lineHeight.relaxed,
): number {
  return Math.round(size * ratio);
}
