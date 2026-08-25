import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.leading}>
        <View style={styles.titleRow}>
          <View style={styles.accent} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const ACCENT_WIDTH = 3;

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  leading: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  accent: {
    width: ACCENT_WIDTH,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  title: {
    flex: 1,
    fontSize: fontSize.sectionTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    paddingLeft: ACCENT_WIDTH + spacing.sm,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    color: colors.muted,
    lineHeight: 18,
  },
  actionBtn: {
    paddingTop: 4,
  },
  action: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  pressed: { opacity: 0.6 },
});
