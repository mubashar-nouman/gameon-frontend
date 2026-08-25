export const colors = {
  primary: '#00BE76',
  primaryDark: '#00905A',
  /** Tinted green surface for subtle positive badges — never a page background. */
  primarySoft: '#E8F8F0',
  grassStripe: '#00A868',
  accent: '#F2C94C',
  accentDark: '#8A6D1A',
  accentSoft: '#FDF6E3',
  white: '#FFFFFF',
  background: '#FFFFFF',
  /** Near-white page so soft card shadows read cleanly. */
  pageBackground: '#F7F8F8',
  /** Hairline for search chips — not for cards. */
  borderSubtle: '#ECEEEF',
  /** Card outline — pairs with soft shadow for a clean edge on page bg. */
  cardBorder: '#E6E8EA',
  backgroundSecondary: '#F3F4F5',
  border: '#E5E7EB',
  text: '#111827',
  muted: '#6B7280',
  /** Splash/onboarding only — dark scene backdrop, never an in-app background. */
  splashBackground: '#04150E',
  /** Secondary text on dark splash surfaces. */
  onDarkMuted: '#C7D9CF',
  /** Splash scrim stops — alpha overlays over the stadium art, dark to darkest. */
  scrimSoft: 'rgba(4,21,14,0.15)',
  scrimMid: 'rgba(4,21,14,0.75)',
  scrimStrong: 'rgba(4,21,14,0.97)',
  /** Pressed state for bordered buttons on dark surfaces. */
  pressedOnDark: 'rgba(255,255,255,0.08)',
  /** Placeholder tints for player avatars until real photos exist. */
  avatarOne: '#C7D2DC',
  avatarTwo: '#D6CBBE',
  avatarThree: '#C2CFC6',
  avatarFour: '#D3C9D6',
  /** Soft gray shadow tint — never pure black for card elevation. */
  shadow: '#1A1A1A',
  error: '#DC2626',
  success: '#059669',
} as const;
