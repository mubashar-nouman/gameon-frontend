export const colors = {
  primary: '#00BE76',
  primaryDark: '#00905A',
  /** Tinted green surface for subtle positive badges — never a page background. */
  primarySoft: '#E8F8F0',
  /** Diagonal wash behind the open-matches banner. */
  bannerTintTop: '#F2FBF6',
  bannerTintBottom: '#D8F2E4',
  grassStripe: '#00A868',
  accent: '#F2C94C',
  accentDark: '#8A6D1A',
  accentSoft: '#FDF6E3',
  /** Warm border tint paired with accentSoft surfaces. */
  accentBorder: '#EDDA9A',
  white: '#FFFFFF',
  background: '#FFFFFF',
  /** Near-white page so soft card shadows read cleanly. */
  pageBackground: '#F1F3F4',
  /** Hairline for search chips — not for cards. */
  borderSubtle: '#ECEEEF',
  /** Card outline — pairs with soft shadow for a clean edge on page bg. */
  cardBorder: '#DFE3E6',
  /** Strong card outline for the bordered treatment. */
  cardBorderStrong: '#CBD2D7',
  /** Very light top-to-bottom wash for gradient cards. */
  /** Translucent white for strips sitting on a gradient card. */
  surfaceOnCard: 'rgba(255,255,255,0.72)',
  cardGradientTop: '#FFFFFF',
  cardGradientBottom: '#E4F2EA',
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
  /** Tinted surface for cancelled or destructive states. */
  errorSoft: '#FDECEC',
  success: '#059669',
} as const;

/** Subtle inactive tints for sport category chips — selected state stays brand green. */
export const sportTints = {
  football: { soft: '#E8F8F0', border: '#B8E6D0' },
  cricket: { soft: '#FDF6E3', border: '#EDDA9A' },
  badminton: { soft: '#EEF4FC', border: '#C5D9F2' },
  basketball: { soft: '#FFF2EA', border: '#F0CDB0' },
  padel: { soft: '#F4F0FA', border: '#D5C8E8' },
} as const;
