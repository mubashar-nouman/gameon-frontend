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

import { Button, Input, ScreenHeader } from '../components/ui';
import { allAreas, profile } from '../data';
import { useSession } from '../session/SessionContext';
import type { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

/** Leading '@' is owned by the display, not the stored value. */
function normaliseHandle(value: string): string {
  return value.replace(/^@+/, '');
}

export default function EditProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { session, update } = useSession();

  // The session is the source of truth once signed in; the seeded profile is
  // only a fallback for the not-yet-authenticated case.
  const initialName = session?.name ?? profile.name;
  const initialArea = session?.homeArea ?? profile.location;

  const [name, setName] = useState(initialName);
  const [handle, setHandle] = useState(normaliseHandle(profile.handle));
  const [location, setLocation] = useState(initialArea);
  const [areaOpen, setAreaOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const areas = useMemo(allAreas, []);

  // Only enable Save once something actually differs, so the button reflects
  // whether there is anything to persist.
  const trimmedName = name.trim();
  const trimmedHandle = normaliseHandle(handle.trim());
  const isDirty =
    trimmedName !== initialName ||
    trimmedHandle !== normaliseHandle(profile.handle) ||
    location !== initialArea;
  const isValid = trimmedName.length > 0 && trimmedHandle.length > 0;

  const initial = trimmedName.charAt(0) || initialName.charAt(0);

  const save = async () => {
    if (!isDirty || !isValid || saving) return;
    setSaving(true);
    await update({ name: trimmedName, homeArea: location });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Edit profile"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing['3xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar — the initial tracks the name field as it is typed. */}
          <View style={styles.avatarBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.changePhoto,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="camera-outline" size={15} color={colors.primaryDark} />
              <Text style={styles.changePhotoText}>Change photo</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Input
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <View style={styles.field}>
              <Input
                label="Username"
                value={handle}
                onChangeText={(text) => setHandle(normaliseHandle(text))}
                placeholder="username"
                autoCapitalize="none"
                autoCorrect={false}
                icon="at-outline"
                returnKeyType="done"
              />
            </View>

            {/* Area is a pick-from-list, not free text, so it always matches
                a real area in the data layer. */}
            <View style={styles.field}>
              <Text style={styles.label}>Home area</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAreaOpen((open) => !open)}
                style={({ pressed }) => [
                  styles.select,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="location-outline" size={20} color={colors.muted} />
                <Text style={styles.selectText} numberOfLines={1}>
                  {location}
                </Text>
                <Ionicons
                  name={areaOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.muted}
                />
              </Pressable>

              {areaOpen ? (
                <View style={styles.options}>
                  {areas.map(({ city, area }, index) => {
                    const label = `${area.name}, ${city.name}`;
                    const selected = label === location;
                    return (
                      <Pressable
                        key={`${city.id}-${area.id}`}
                        accessibilityRole="button"
                        onPress={() => {
                          setLocation(label);
                          setAreaOpen(false);
                        }}
                        style={({ pressed }) => [
                          styles.option,
                          index > 0 && styles.optionDivided,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selected && styles.optionTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {label}
                        </Text>
                        {selected ? (
                          <Ionicons
                            name="checkmark"
                            size={17}
                            color={colors.primary}
                          />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.note}>
            Your name and rating are visible to other players when you join or
            host a match.
          </Text>

          <View style={styles.actions}>
            <Button
              label="Save changes"
              onPress={() => void save()}
              disabled={!isDirty || !isValid}
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
  content: { paddingHorizontal: screenPadding },
  pressed: { opacity: 0.7 },

  avatarBlock: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 82,
    height: 82,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 41,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.statHero,
    lineHeight: leading(fontSize.statHero, 1.2),
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  changePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  changePhotoText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },

  card: {
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  field: { marginTop: spacing.lg },
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },
  select: {
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
  selectText: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge),
    color: colors.text,
  },
  options: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionDivided: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },

  note: {
    marginTop: spacing.lg,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  actions: { marginTop: spacing.xl },
});
