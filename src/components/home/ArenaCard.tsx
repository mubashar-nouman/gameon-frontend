import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SportArt from '../art/SportArt';
import { getArenaImage } from '../../data/arenaImages';
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
  // Derive a stable variant from the arena id so a given arena always shows
  // the same photo, while neighbouring cards differ.
  const variant = Number(arena.id.replace(/\D/g, '')) || 0;
  const photo = getArenaImage(arena.sportId, variant);

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.imageWrap}>
          {photo ? (
            <Image source={photo} style={styles.art} resizeMode="cover" />
          ) : (
            <SportArt
              sportId={arena.sportId}
              style={styles.art}
              radius={radius.card}
            />
          )}

          <View style={styles.distancePill}>
            <Ionicons name="navigate-outline" size={11} color={colors.text} />
            <Text style={styles.distanceText}>{arena.distanceKm} km</Text>
          </View>

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
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {arena.name}
            </Text>
            {sport ? (
              <View style={styles.sportPill}>
                <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                <Text style={styles.sportName}>{sport.name}</Text>
              </View>
            ) : null}
          </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sportEmoji: { fontSize: fontSize.caption },
  sportName: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
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
