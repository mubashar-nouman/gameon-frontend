import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatPkr, type OpenMatch } from '../../data';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = {
  matches: OpenMatch[];
  /** Distance to the closest match's arena, when known. */
  nearestKm?: number;
  sportName: string;
  areaLabel?: string;
  onPress?: () => void;
};

/**
 * One-line summary standing in for a matches carousel — the full list lives on
 * the Matches tab, so Home only advertises that something is waiting.
 */
export default function MatchInviteBanner({
  matches,
  nearestKm,
  sportName,
  areaLabel,
  onPress,
}: Props) {
  const count = matches.length;
  const empty = count === 0;

  // Cheapest entry is the most persuasive number to lead with.
  const cheapest = empty
    ? undefined
    : matches.reduce((low, match) =>
        match.pricePerPlayer < low.pricePerPlayer ? match : low,
      );

  const tonight = matches.filter((match) =>
    match.time.toLowerCase().includes('tonight'),
  ).length;
  const headline = tonight > 0 ? tonight : count;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        empty
          ? `No ${sportName} matches. Browse all matches.`
          : `${headline} matches need players. View all.`
      }
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={empty ? 'people-outline' : 'people'}
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {empty
            ? `No ${sportName.toLowerCase()} matches${
                areaLabel ? ` in ${areaLabel}` : ''
              }`
            : `${headline} ${headline === 1 ? 'match needs' : 'matches need'} players${
                tonight > 0 ? ' tonight' : ''
              }`}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {empty
            ? 'Create one, or browse every open match'
            : `${
                nearestKm !== undefined ? `Nearest ${nearestKm} km · ` : ''
              }from ${formatPkr(cheapest!.pricePerPlayer)} per player`}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
  },
  pressed: { opacity: 0.92 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  title: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
});
