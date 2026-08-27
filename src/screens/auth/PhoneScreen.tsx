import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { AppLogo } from '../../components/splash/AppLogo';
import { Button } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import {
  DIAL_CODE,
  formatNational,
  isValidNational,
  toNational,
} from '../../session/phone';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = StackScreenProps<AuthStackParamList, 'Phone'>;

export default function PhoneScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [national, setNational] = useState('');
  const [touched, setTouched] = useState(false);

  const valid = isValidNational(national);
  // Only nag once they have entered enough to be wrong on purpose.
  const showError = touched && national.length > 0 && !valid;

  const submit = () => {
    if (!valid) {
      setTouched(true);
      return;
    }
    navigation.navigate('Otp', { phone: national });
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top + spacing['2xl'],
              paddingBottom: insets.bottom + spacing['2xl'],
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppLogo />

          <Text style={styles.title}>What's your number?</Text>
          <Text style={styles.subtitle}>
            We'll text you a code to verify it. No spam, ever.
          </Text>

          <View
            style={[
              styles.field,
              showError && styles.fieldError,
            ]}
          >
            <View style={styles.dialCode}>
              <Text style={styles.flag}>🇵🇰</Text>
              <Text style={styles.dialCodeText}>{DIAL_CODE}</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              value={formatNational(national)}
              onChangeText={(text) => setNational(toNational(text))}
              onBlur={() => setTouched(true)}
              placeholder="300 1234567"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submit}
              maxLength={11}
              style={styles.input}
            />
          </View>

          {showError ? (
            <View style={styles.errorRow}>
              <Ionicons
                name="alert-circle"
                size={14}
                color={colors.error}
              />
              <Text style={styles.errorText}>
                Enter a valid mobile number, e.g. 300 1234567
              </Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button label="Continue" onPress={submit} disabled={!valid} />
          </View>

          <Text style={styles.legal}>
            By continuing you agree to our{' '}
            <Text style={styles.legalLink}>Terms</Text> and{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text>.
          </Text>

          <View style={styles.flex} />

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Otp', { phone: '3001234567' })}
            style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
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
    marginTop: spacing.xl,
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

  field: {
    marginTop: spacing['2xl'],
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  fieldError: { borderColor: colors.error },
  dialCode: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flag: { fontSize: fontSize.callout },
  dialCodeText: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: spacing.md,
    backgroundColor: colors.borderSubtle,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.text,
    letterSpacing: 0.5,
    padding: 0,
  },

  errorRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  errorText: {
    flexShrink: 1,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.error,
  },

  actions: { marginTop: spacing.xl },
  legal: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption, 1.6),
    color: colors.muted,
  },
  legalLink: { fontWeight: fontWeight.bold, color: colors.primaryDark },

  skip: { alignSelf: 'center', padding: spacing.md },
  skipText: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.muted,
  },
});
