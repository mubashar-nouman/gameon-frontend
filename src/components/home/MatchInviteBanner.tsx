import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
          ? `Start the first ${sportName} match`
          : `${headline} matches need players. View all.`
      }
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={
          empty
            ? [colors.white, colors.pageBackground]
            : [colors.bannerTintTop, colors.bannerTintBottom]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.banner, empty ? styles.bannerEmpty : styles.bannerLive]}
      >
        {/* Soft accent bloom in the corner, behind the content. */}
        {!empty ? <View style={styles.bloom} pointerEvents="none" /> : null}

        <View style={[styles.iconWrap, empty && styles.iconWrapEmpty]}>
          <Ionicons
            name={empty ? 'add' : 'people'}
            size={20}
            color={empty ? colors.primary : colors.white}
          />
        </View>

        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={2}>
            {empty
              ? `Start the first ${sportName.toLowerCase()} match${
                  areaLabel ? ` in ${areaLabel}` : ''
                }`
              : `${headline} ${
                  headline === 1 ? 'match needs' : 'matches need'
                } players${tonight > 0 ? ' tonight' : ''}`}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {empty
              ? 'Post a game and let nearby players join'
              : `${
                  nearestKm !== undefined ? `Nearest ${nearestKm} km · ` : ''
                }from ${formatPkr(cheapest!.pricePerPlayer)} per player`}
          </Text>
        </View>

        <View style={[styles.cta, empty && styles.ctaEmpty]}>
          <Text style={[styles.ctaText, empty && styles.ctaTextEmpty]}>
            {empty ? 'Create' : 'View'}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={13}
            color={empty ? colors.primary : colors.white}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: screenPadding,
    borderRadius: radius.card,
  },
  pressed: { opacity: 0.94 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bannerLive: { borderColor: colors.primary },
  bannerEmpty: { borderColor: colors.border, borderStyle: 'dashed' },

  bloom: {
    position: 'absolute',
    top: -46,
    right: -30,
    width: 132,
    height: 132,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 66,
    backgroundColor: colors.white,
    opacity: 0.35,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapEmpty: { backgroundColor: colors.primarySoft },

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

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  ctaEmpty: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ctaText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  ctaTextEmpty: { color: colors.primary },
});
