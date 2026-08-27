import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** Rendered at the trailing edge — an action button, usually. */
  trailing?: React.ReactNode;
};

/**
 * Back button + title bar shared by the pushed sub-screens. The title block
 * flexes so a long title truncates instead of pushing the trailing slot off
 * the row.
 */
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  trailing,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.md,
    backgroundColor: colors.pageBackground,
  },
  pressed: { opacity: 0.7 },
  backBtn: {
    width: 36,
    height: 36,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  title: {
    fontSize: fontSize.screenTitle,
    lineHeight: leading(fontSize.screenTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
});
