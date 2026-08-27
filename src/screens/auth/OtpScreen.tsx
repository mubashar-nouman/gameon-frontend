import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputKeyPressEventData,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { Button, ScreenHeader } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import { OTP_LENGTH, digitsOnly, maskForOtp } from '../../session/phone';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = StackScreenProps<AuthStackParamList, 'Otp'>;

const RESEND_SECONDS = 30;

export default function OtpScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { phone } = route.params;

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const value = code.join('');
  const complete = value.length === OTP_LENGTH;

  const focus = (index: number) => {
    inputs.current[index]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const digits = digitsOnly(text);
    if (!digits) {
      // Field cleared by the keyboard rather than by backspace.
      setCode((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    // A paste or an SMS autofill arrives as several digits at once — spread
    // them across the remaining boxes instead of dropping all but the first.
    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i += 1) {
        next[index + i] = digits[i]!;
      }
      return next;
    });

    const landed = Math.min(index + digits.length, OTP_LENGTH - 1);
    focus(landed);
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    // Backspace on an empty box steps back and clears the previous one, which
    // is what people expect from a segmented code field.
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      setCode((prev) => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
      focus(index - 1);
    }
  };

  const verify = () => {
    if (!complete) return;
    navigation.navigate('ProfileSetup', { phone });
  };

  const resend = () => {
    setSecondsLeft(RESEND_SECONDS);
    setCode(Array(OTP_LENGTH).fill(''));
    focus(0);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing['2xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            Sent to {maskForOtp(phone)}
          </Text>

          <View style={styles.boxes}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => {
              const filled = Boolean(code[index]);
              return (
                <TextInput
                  key={index}
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  value={code[index]}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                  autoComplete={index === 0 ? 'sms-otp' : 'off'}
                  autoFocus={index === 0}
                  // Long enough to receive a full pasted code; the handler
                  // caps what actually lands in each box.
                  maxLength={OTP_LENGTH}
                  selectTextOnFocus
                  style={[styles.box, filled && styles.boxFilled]}
                />
              );
            })}
          </View>

          <View style={styles.resendRow}>
            {secondsLeft > 0 ? (
              <Text style={styles.resendWait}>
                Resend code in {secondsLeft}s
              </Text>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={resend}
                hitSlop={8}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Text style={styles.resendLink}>Resend code</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.actions}>
            <Button label="Verify" onPress={verify} disabled={!complete} />
          </View>

          <Text style={styles.hint}>
            Demo build — any 6 digits will work.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: screenPadding },
  pressed: { opacity: 0.7 },

  title: {
    fontSize: fontSize.display,
    lineHeight: leading(fontSize.display, 1.2),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.5),
    color: colors.muted,
  },

  boxes: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    minWidth: 0,
    height: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontSize: fontSize.sectionTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    padding: 0,
  },
  boxFilled: { borderColor: colors.primary },

  resendRow: { marginTop: spacing.lg, alignItems: 'center' },
  resendWait: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },
  resendLink: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },

  actions: { marginTop: spacing.xl },
  hint: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
});
