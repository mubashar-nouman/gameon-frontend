import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '../ui/Card';
import { formatPkr, getSport, type OpenMatch } from '../../data';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  match: OpenMatch;
  onJoin?: () => void;
  layout?: 'compact' | 'wide';
};

export default function OpenMatchCard({
  match,
  onJoin,
  layout = 'compact',
}: Props) {
  const sport = getSport(match.sportId);
  const fill = Math.min(match.playersJoined / match.playersNeeded, 1);
  const spotsLeft = match.playersNeeded - match.playersJoined;

  return (
    <Card style={[styles.shell, layout === 'wide' && styles.shellWide]}>
      <View style={styles.body}>
        <View style={styles.top}>
          {sport ? (
            <View style={styles.sportPill}>
              <Text style={styles.sportEmoji}>{sport.emoji}</Text>
              <Text style={styles.sportName}>{sport.name}</Text>
            </View>
          ) : null}
          <Text style={styles.time} numberOfLines={1}>
            {match.time}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {match.title}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {match.area} · {formatPkr(match.pricePerPlayer)}/player
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { flex: fill }]} />
            <View style={{ flex: 1 - fill }} />
          </View>
          <Text style={styles.count} numberOfLines={1}>
            {match.playersJoined}/{match.playersNeeded}
            {spotsLeft > 0 ? ` · ${spotsLeft} left` : ' · Full'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onJoin}
          style={({ pressed }) => [styles.joinBtn, pressed && styles.joinPressed]}
        >
          <Text style={styles.joinText}>Join</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  shell: { width: 248 },
  shellWide: { width: '100%' },
  body: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  sportEmoji: { fontSize: fontSize.caption },
  sportName: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.accentDark,
  },
  time: {
    flex: 1,
    textAlign: 'right',
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.muted,
  },
  title: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  meta: {
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
  progressRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
  count: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.accentDark,
    maxWidth: 72,
  },
  joinBtn: {
    marginTop: spacing.xs,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinPressed: { backgroundColor: colors.primaryDark },
  joinText: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
