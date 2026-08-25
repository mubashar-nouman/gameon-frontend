import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import SportArt from '../art/SportArt';
import Card from '../ui/Card';
import { formatPkr, getSport, type Arena } from '../../data';
import { colors } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  arena: Arena;
  saved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
};

export default function ArenaCard({
  arena,
  saved = false,
  onPress,
  onToggleSave,
}: Props) {
  const sport = getSport(arena.sportId);

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.imageWrap}>
          <SportArt
            sportId={arena.sportId}
            style={styles.art}
            radius={radius.card}
          />

          <View style={styles.distancePill}>
            <Ionicons name="navigate-outline" size={11} color={colors.text} />
            <Text style={styles.distanceText}>{arena.distanceKm} km</Text>
          </View>

          {sport ? (
            <View style={styles.sportPill}>
              <Text style={styles.sportEmoji}>{sport.emoji}</Text>
              <Text style={styles.sportName}>{sport.name}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save arena'}
            hitSlop={8}
            onPress={onToggleSave}
            style={styles.saveBtn}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={17}
              color={saved ? colors.primary : colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {arena.name}
          </Text>

          <Text style={styles.area} numberOfLines={1}>
            {arena.area}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color={colors.text} />
              <Text style={styles.ratingText}>{arena.rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({arena.reviewCount})</Text>
            </View>

            <Text style={styles.grounds}>
              {arena.grounds} {arena.grounds === 1 ? 'ground' : 'grounds'}
            </Text>

            <Text style={styles.price}>
              {formatPkr(arena.pricePerHour)}
              <Text style={styles.perHour}>/hr</Text>
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.slotPill}>
              <Ionicons name="time-outline" size={12} color={colors.primaryDark} />
              <Text style={styles.slotText}>{arena.activeWindow}</Text>
            </View>
            {arena.facilities[0] ? (
              <Text style={styles.facility} numberOfLines={1}>
                {arena.facilities.slice(0, 2).join(' · ')}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

const IMAGE_HEIGHT = 112;

const styles = StyleSheet.create({
  card: { width: '100%' },
  pressed: { backgroundColor: colors.backgroundSecondary },
  imageWrap: {
    height: IMAGE_HEIGHT,
    backgroundColor: colors.backgroundSecondary,
  },
  art: { width: '100%', height: IMAGE_HEIGHT },
  distancePill: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    ...elevation.soft,
  },
  distanceText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  sportPill: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    ...elevation.soft,
  },
  sportEmoji: { fontSize: 12 },
  sportName: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  saveBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.soft,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  area: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  statsRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  reviews: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  grounds: {
    flex: 1,
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  price: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  perHour: {
    fontWeight: fontWeight.regular,
    color: colors.muted,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  slotText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.primaryDark,
  },
  facility: {
    flex: 1,
    fontSize: fontSize.caption,
    color: colors.muted,
    textAlign: 'right',
  },
});
