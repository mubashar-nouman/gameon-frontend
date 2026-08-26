import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { radius } from '../../theme/radius';

type Variant = 'elevated' | 'outline' | 'bordered' | 'gradient';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * `elevated` — hairline border + soft shadow (default)
   * `outline`  — border only, no shadow
   * `bordered` — strong 1.5px border, no shadow; cards read as distinct blocks
   * `gradient` — subtle white-to-tint wash behind the content
   */
  variant?: Variant;
  /** @deprecated Use variant="outline" instead. */
  flat?: boolean;
};

/**
 * Shadow lives on the outer shell; content clips on the inner shell.
 */
export default function Card({
  children,
  style,
  variant,
  flat = false,
}: Props) {
  const resolved = flat ? 'outline' : (variant ?? 'elevated');

  if (resolved === 'gradient') {
    return (
      <View style={[styles.shell, styles.gradientShell, elevation.card, style]}>
        <LinearGradient
          colors={[colors.cardGradientTop, colors.cardGradientBottom]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.inner}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.shell,
        resolved === 'bordered' ? styles.borderedShell : null,
        resolved === 'elevated' ? elevation.card : null,
        style,
      ]}
    >
      <View style={[styles.inner, styles.innerSolid]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    // A full 1px border, not a hairline: the page background is near-white, so
    // a hairline plus soft shadow leaves cards visually bleeding into it.
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  borderedShell: {
    borderWidth: 1.5,
    borderColor: colors.cardBorderStrong,
  },
  gradientShell: {
    borderColor: colors.cardBorder,
  },
  inner: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  innerSolid: { backgroundColor: colors.white },
});
