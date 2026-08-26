import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

export type Segment = { id: string; label: string; count?: number };

type Props = {
  segments: Segment[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function SegmentedTabs({
  segments,
  selectedId,
  onSelect,
}: Props) {
  return (
    <View style={styles.track}>
      {segments.map((segment) => {
        const active = segment.id === selectedId;
        return (
          <Pressable
            key={segment.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(segment.id)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {segment.label}
            </Text>
            {segment.count !== undefined && segment.count > 0 ? (
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text
                  style={[styles.badgeText, active && styles.badgeTextActive]}
                >
                  {segment.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.pageBackground,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  segmentActive: { backgroundColor: colors.white },
  label: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.muted,
  },
  labelActive: { color: colors.text },
  badge: {
    minWidth: 18,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  badgeActive: { backgroundColor: colors.primary },
  badgeText: {
    textAlign: 'center',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.muted,
  },
  badgeTextActive: { color: colors.white },
});
