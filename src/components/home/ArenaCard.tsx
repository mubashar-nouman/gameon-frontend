import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import SportArt from '../art/SportArt';
import { getArenaImage } from '../../data/arenaImages';
import Card from '../ui/Card';
import { formatPkr, type Arena } from '../../data';
import { colors } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = {
  arena: Arena;
  saved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
};

const IMAGE_SIZE = 104;

export default function ArenaCard({
  arena,
  saved = false,
  onPress,
  onToggleSave,
}: Props) {
  // Stable variant from the arena id so a given arena always shows the same
  // photo, while neighbouring cards differ.
  const variant = Number(arena.id.replace(/\D/g, '')) || 0;
  const photo = getArenaImage(arena.sportId, variant);

  return (
    <Card variant="outline" style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${arena.name}, ${arena.area}`}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={styles.media}>
          {photo ? (
            <Image source={photo} style={styles.art} resizeMode="cover" />
          ) : (
            <SportArt sportId={arena.sportId} style={styles.art} />
          )}

          <View style={styles.ratingPill}>
            <Ionicons name="star" size={10} color={colors.accent} />
            <Text style={styles.ratingText}>{arena.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {arena.name}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from saved' : 'Save arena'}
              hitSlop={10}
              onPress={onToggleSave}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={18}
                color={saved ? colors.primary : colors.muted}
              />
            </Pressable>
          </View>

          <Text style={styles.meta} numberOfLines={1}>
            {arena.area} · {arena.distanceKm} km
          </Text>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <View style={styles.liveDot} />
              <Text style={styles.tagText}>{arena.activeWindow}</Text>
            </View>
            <Text style={styles.grounds}>
              {arena.grounds} {arena.grounds === 1 ? 'ground' : 'grounds'}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price} numberOfLines={1}>
              {formatPkr(arena.pricePerHour)}
              <Text style={styles.perHour}> / hr</Text>
            </Text>
            <View style={styles.bookBtn}>
              <Text style={styles.bookText}>Book</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%' },
  pressed: { opacity: 0.9 },
  row: { flexDirection: 'row', padding: spacing.md, gap: spacing.md },

  media: { width: IMAGE_SIZE, height: IMAGE_SIZE },
  art: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius.md,
  },
  ratingPill: {
    position: 'absolute',
    left: spacing.xs,
    bottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    ...elevation.soft,
  },
  ratingText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  body: { flex: 1, justifyContent: 'space-between' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

  tagRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  liveDot: {
    width: 5,
    height: 5,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  tagText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
  },
  grounds: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

  priceRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: {
    // flexShrink lets the label give way before it clips; the button keeps its
    // intrinsic width via flexShrink: 0 below.
    flexShrink: 1,
    fontSize: fontSize.callout,
    lineHeight: leading(fontSize.callout, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  perHour: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    color: colors.muted,
  },
  bookBtn: {
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  bookText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
});
