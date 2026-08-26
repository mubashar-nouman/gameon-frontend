import { forwardRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = TextInputProps & {
  label?: string;
  /** Ionicons name rendered inside the field, left of the text. */
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'outline' | 'filled';
};

const Input = forwardRef<TextInput, Props>(function Input(
  { label, icon, variant = 'outline', style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const isFilled = variant === 'filled';

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          isFilled ? styles.fieldFilled : null,
          focused ? styles.fieldFocused : null,
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={20} color={colors.muted} />
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.muted}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
  field: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  fieldFilled: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.backgroundSecondary,
  },
  fieldFocused: { borderColor: colors.primary, backgroundColor: colors.white },
  input: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.regular,
    color: colors.text,
    // Reset RN's default TextInput padding so height stays exactly 48.
    padding: 0,
  },
});
