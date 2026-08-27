import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../components/ui';
import { formatPkr, getSport } from '../data';
import { useMatches } from '../matches/MatchesContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { duration, easing, translate } from '../theme/motion';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = StackScreenProps<RootStackParamList, 'MatchCreated'>;

export default function MatchCreatedScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { matches } = useMatches();
  const match = matches.find((m) => m.id === route.params.matchId);

  const mark = useSharedValue(0);
  const body = useSharedValue(0);

  useEffect(() => {
    mark.value = withTiming(1, {
      duration: duration.slow,
      easing: Easing.bezier(...easing.standard),
    });
    body.value = withDelay(
      120,
      withTiming(1, {
        duration: duration.slow,
        easing: Easing.bezier(...easing.standard),
      }),
    );
  }, [mark, body]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: mark.value,
    transform: [{ scale: 0.85 + mark.value * 0.15 }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: body.value,
    transform: [{ translateY: translate.enter * (1 - body.value) }],
  }));

  const sport = getSport(match?.sportId ?? '');
  const spotsLeft = match
    ? Math.max(0, match.playersNeeded - match.playersJoined)
    : 0;

  const share = () => {
    if (!match) return;
    void Share.share({
      message:
        `${match.title}\n${sport?.name ?? 'Match'} · ${match.area}\n` +
        `${match.time} · ${formatPkr(match.pricePerPlayer)} per player\n` +
        `${spotsLeft} spots left — join me on GameOn.`,
    });
  };

  // Dismissing always returns to the tabs, never back into the form.
  const done = () => navigation.navigate('Tabs', { screen: 'Matches' });

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + spacing['4xl'],
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      <Animated.View style={[styles.markWrap, markStyle]}>
        <View style={styles.mark}>
          <Ionicons name="checkmark" size={40} color={colors.white} />
        </View>
      </Animated.View>

      <Animated.View style={bodyStyle}>
        <Text style={styles.title}>Match published</Text>
        <Text style={styles.subtitle}>
          Players nearby can find and join it now.
        </Text>

        {match ? (
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.emoji}>{sport?.emoji}</Text>
              <View style={styles.cardHeadText}>
                <Text style={styles.matchTitle} numberOfLines={1}>
                  {match.title}
                </Text>
                <Text style={styles.matchMeta} numberOfLines={1}>
                  {sport?.name} · {match.skillLevel}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Row icon="location-outline" text={match.area} />
            <Row icon="time-outline" text={match.time} />
            <Row
              icon="people-outline"
              text={`${match.playersJoined}/${match.playersNeeded} joined · ${spotsLeft} spots left`}
            />
            <Row
              icon="cash-outline"
              text={`${formatPkr(match.pricePerPlayer)} per player`}
            />
          </View>
        ) : null}
      </Animated.View>

      <View style={styles.spacer} />

      <Animated.View style={[styles.actions, bodyStyle]}>
        <Button label="Share with friends" onPress={share} />
        <Button label="Done" variant="secondary" onPress={done} />
      </Animated.View>
    </View>
  );
}

function Row({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text style={styles.rowText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: screenPadding,
    backgroundColor: colors.pageBackground,
  },
  markWrap: { alignItems: 'center', marginBottom: spacing.xl },
  mark: {
    width: 76,
    height: 76,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: fontSize.display,
    lineHeight: leading(fontSize.display, 1.2),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.5),
    color: colors.muted,
  },

  card: {
    marginTop: spacing['2xl'],
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  emoji: { fontSize: fontSize.sportEmoji },
  cardHeadText: { flex: 1, minWidth: 0 },
  matchTitle: {
    fontSize: fontSize.callout,
    lineHeight: leading(fontSize.callout, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  matchMeta: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
    backgroundColor: colors.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.text,
  },

  spacer: { flex: 1 },
  actions: { gap: spacing.md },
});
