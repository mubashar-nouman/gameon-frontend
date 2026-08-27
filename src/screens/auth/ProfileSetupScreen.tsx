import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { Button, Input, ScreenHeader } from '../../components/ui';
import { allAreas } from '../../data';
import type { AuthStackParamList } from '../../navigation/types';
import { toE164 } from '../../session/phone';
import { useSession } from '../../session/SessionContext';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = StackScreenProps<AuthStackParamList, 'ProfileSetup'>;

export default function ProfileSetupScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { phone } = route.params;
  const { signIn } = useSession();

  const areas = useMemo(allAreas, []);
  const [name, setName] = useState('');
  const [areaIndex, setAreaIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const trimmed = name.trim();
  const ready = trimmed.length >= 2 && areaIndex !== null;

  const finish = async () => {
    if (!ready || saving) return;
    setSaving(true);
    const picked = areas[areaIndex];
    await signIn({
      name: trimmed,
      phone: toE164(phone),
      homeArea: picked ? `${picked.area.name}, ${picked.city.name}` : '',
    });
    // No navigation.reset here: the root swaps the auth stack out for the app
    // as soon as the session exists.
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
          <Text style={styles.title}>Almost there</Text>
          <Text style={styles.subtitle}>
            Tell us who you are so players know who they're matching with.
          </Text>

          <View style={styles.card}>
            <Input
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ahmed Khan"
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
            />
          </View>

          <Text style={styles.sectionLabel}>Where do you usually play?</Text>
          <View style={styles.areaWrap}>
            {areas.map(({ city, area }, index) => {
              const selected = areaIndex === index;
              return (
                <Pressable
                  key={`${city.id}-${area.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setAreaIndex(index)}
                  style={({ pressed }) => [
                    styles.areaChip,
                    selected && styles.areaChipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.white}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.areaText,
                      selected && styles.areaTextSelected,
                    ]}
                  >
                    {area.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.note}>
            You can change this any time from your profile.
          </Text>

          <View style={styles.actions}>
            <Button
              label="Start playing"
              onPress={() => void finish()}
              disabled={!ready}
              loading={saving}
            />
          </View>
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

  card: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  areaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  areaChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  areaText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  areaTextSelected: { color: colors.white, fontWeight: fontWeight.bold },

  note: {
    marginTop: spacing.lg,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  actions: { marginTop: spacing.xl },
});
