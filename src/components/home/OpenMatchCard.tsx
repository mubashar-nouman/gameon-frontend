import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatPkr, getSport, type OpenMatch } from '../../data';
import Card from '../ui/Card';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = {
  match: OpenMatch;
  /** "wide" stretches to the container instead of the fixed carousel width. */
  layout?: 'carousel' | 'wide';
  onJoin?: () => void;
};

export default function OpenMatchCard({
  match,
  layout = 'carousel',
  onJoin,
}: Props) {
  const sport = getSport(match.sportId);
  const filled = match.playersJoined / match.playersNeeded;
  const spotsLeft = match.playersNeeded - match.playersJoined;

  return (
    <Card style={[styles.shell, layout === 'wide' && styles.shellWide]}>
      <View style={styles.header}>
        <View style={styles.sportPill}>
          <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
          <Text style={styles.sportName}>{sport?.name}</Text>
        </View>
        <Text style={styles.time} numberOfLines={1}>
          {match.time}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {match.title}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={13} color={colors.muted} />
        <Text style={styles.meta} numberOfLines={1}>
          {match.area}
        </Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { flex: Math.min(filled, 1) }]}
          />
          <View style={{ flex: Math.max(1 - filled, 0) }} />
        </View>
        <Text style={styles.count}>
          {match.playersJoined}/{match.playersNeeded}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>
          {formatPkr(match.pricePerPlayer)}
          <Text style={styles.perPlayer}> / player</Text>
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Join ${match.title}`}
          onPress={onJoin}
          style={({ pressed }) => [styles.joinBtn, pressed && styles.joinPressed]}
        >
          <Text style={styles.joinText}>
            {spotsLeft > 0 ? 'Join' : 'Full'}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  shell: { width: 248, padding: spacing.lg },
  shellWide: { width: '100%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sportPill: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  sportEmoji: { fontSize: fontSize.caption },
  sportName: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.accentDark,
    textAlignVertical: 'center',
  },
  time: {
    flexShrink: 1,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.medium,
    color: colors.muted,
  },
  title: {
    marginTop: spacing.md,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  metaRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  meta: {
    flex: 1,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  progressRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.pageBackground,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  count: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.muted,
  },
  footer: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  perPlayer: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    color: colors.muted,
  },
  joinBtn: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  joinPressed: { backgroundColor: colors.primaryDark },
  joinText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.white,
    textAlignVertical: 'center',
  },
});
