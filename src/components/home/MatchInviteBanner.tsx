import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  matchCount: number;
  sport: string;
  onPress?: () => void;
};

export default function MatchInviteBanner({
  matchCount,
  sport,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="people" size={18} color={colors.primaryDark} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {matchCount} {sport.toLowerCase()}{' '}
          {matchCount === 1 ? 'match needs' : 'matches need'} players
        </Text>
        <Text style={styles.subtitle}>Join a game near you</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.primary} />
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
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: { opacity: 0.92 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1, gap: 2 },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
});
