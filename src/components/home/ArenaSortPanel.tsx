import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export type SortOption = 'nearest' | 'price' | 'rating';

const OPTIONS: { key: SortOption; label: string; hint: string }[] = [
  { key: 'nearest', label: 'Nearest', hint: 'Closest to you first' },
  { key: 'price', label: 'Cheapest', hint: 'Lowest price first' },
  { key: 'rating', label: 'Top rated', hint: 'Highest rating first' },
];

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

/** Sort options — shown when the search filter button is tapped. */
export default function ArenaSortPanel({ value, onChange }: Props) {
  return (
    <View style={styles.panel}>
      <Text style={styles.label}>Sort arenas by</Text>
      {OPTIONS.map((option, index) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.key)}
            style={({ pressed }) => [
              styles.row,
              index < OPTIONS.length - 1 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>
                {option.label}
              </Text>
              <Text style={styles.rowHint}>{option.hint}</Text>
            </View>
            {selected ? (
              <Ionicons name="checkmark" size={18} color={colors.primary} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingBottom: spacing.xs,
  },
  label: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  rowPressed: { backgroundColor: colors.backgroundSecondary },
  rowText: { flex: 1, gap: 2 },
  rowLabel: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  rowLabelSelected: {
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
  },
  rowHint: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
});
