import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import type { Sport } from '../../data';
import { colors, sportTints } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  sports: Sport[];
  selectedId: string;
  onSelect: (sportId: string) => void;
  embedded?: boolean;
};

export default function SportSelector({
  sports,
  selectedId,
  onSelect,
  embedded = false,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.row,
        embedded ? styles.rowEmbedded : null,
      ]}
    >
      {sports.map((sport) => {
        const active = sport.id === selectedId;
        const tint = sportTints[sport.id as keyof typeof sportTints];

        return (
          <Pressable
            key={sport.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(sport.id)}
            style={({ pressed }) => [
              styles.chip,
              !active && tint
                ? { backgroundColor: tint.soft, borderColor: tint.border }
                : null,
              active && styles.chipActive,
              pressed && !active && styles.chipPressed,
            ]}
          >
            <Text style={styles.emoji}>{sport.emoji}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>
              {sport.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: screenPadding,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  rowEmbedded: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    ...elevation.soft,
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  chipPressed: {
    opacity: 0.88,
  },
  emoji: { fontSize: fontSize.callout },
  label: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: fontWeight.semibold,
  },
});
