import { Platform } from 'react-native';

import { colors } from './colors';

/**
 * Soft, diffuse elevation — never a hard ring.
 * Pair with `colors.cardBorder` hairline on surfaces for a crisp, pro finish.
 */
function softShadow(
  opacity: number,
  radiusValue: number,
  offsetY: number,
  android: number,
) {
  return Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: opacity,
      shadowRadius: radiusValue,
      shadowOffset: { width: 0, height: offsetY },
    },
    android: {
      elevation: android,
      shadowColor: colors.shadow,
    },
    default: {},
  })!;
}

export const elevation = {
  /** Barely-there lift for chips and floating pills. */
  soft: softShadow(0.03, 8, 1, 1),
  /** Primary content cards — tight offset, soft spread. */
  card: softShadow(0.065, 14, 3, 3),
  /** Tab bar, FAB. */
  raised: softShadow(0.08, 18, 5, 4),
} as const;
