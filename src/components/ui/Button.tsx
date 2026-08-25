import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  /** Splash/onboarding only — bordered button on a dark scene. */
  | 'outlineOnDark';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        pressed && !isDisabled ? variantStyles[variant].pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <Text style={[styles.label, variantStyles[variant].label]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
  },
  disabled: { opacity: 0.5 },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: colors.primary },
    pressed: { backgroundColor: colors.primaryDark },
    label: { color: colors.white },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: { backgroundColor: colors.backgroundSecondary },
    label: { color: colors.text },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    pressed: { opacity: 0.6 },
    label: { color: colors.primary },
  }),
  outlineOnDark: StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.onDarkMuted,
    },
    pressed: { backgroundColor: colors.pressedOnDark },
    label: { color: colors.white },
  }),
  destructive: StyleSheet.create({
    container: { backgroundColor: colors.error },
    pressed: { opacity: 0.85 },
    label: { color: colors.white },
  }),
} as const;
