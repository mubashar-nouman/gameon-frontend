import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  label: string;
  selected?: boolean;
  icon?: string;
  onPress?: () => void;
};

export default function Chip({ label, selected = false, icon, onPress }: Props) {
  const tint = selected ? colors.white : colors.muted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : null]}
    >
      {icon ? (
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={tint}
        />
      ) : null}
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  labelSelected: { color: colors.white },
});
