import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Tone = 'neutral' | 'positive' | 'attention';

type Props = {
  label: string;
  tone?: Tone;
};

export default function Badge({ label, tone = 'neutral' }: Props) {
  return (
    <View style={[styles.badge, toneStyles[tone].container]}>
      <Text style={[styles.label, toneStyles[tone].label]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
});

const toneStyles = {
  neutral: StyleSheet.create({
    container: { backgroundColor: colors.backgroundSecondary },
    label: { color: colors.muted },
  }),
  positive: StyleSheet.create({
    container: { backgroundColor: colors.primarySoft },
    label: { color: colors.primaryDark },
  }),
  attention: StyleSheet.create({
    container: { backgroundColor: colors.accentSoft },
    label: { color: colors.accentDark },
  }),
} as const;
