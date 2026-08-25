import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  title: string;
  subtitle?: string;
  /** Rendered on the left, before the text block. */
  leading?: React.ReactNode;
  /** Rendered on the right, in place of the chevron. */
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
};

export default function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  showChevron = false,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      {leading}
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
      {showChevron && !trailing ? (
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: { opacity: 0.6 },
  text: { flex: 1 },
  title: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
});
