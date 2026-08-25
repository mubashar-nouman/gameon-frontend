import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  onPress?: () => void;
};

export default function CreateMatchBanner({ onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="people" size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Create an open match</Text>
        <Text style={styles.body}>Need players? Let others join your game.</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoft,
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
  text: { flex: 1, gap: 2 },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  body: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
});
