import { useMemo, useState } from 'react';
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

import { Button, Input, ScreenHeader } from '../components/ui';
import {
  allAreas,
  bookingDates,
  formatPkr,
  getSport,
  slots,
  sports,
} from '../data';
import { useMatches } from '../matches/MatchesContext';
import type { RootStackParamList } from '../navigation/types';
import { useSession } from '../session/SessionContext';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = StackScreenProps<RootStackParamList, 'CreateMatch'>;

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Any level'];

/** Typical squad sizes, so hosts rarely have to type a number. */
const SQUAD_PRESETS: Record<string, number> = {
  cricket: 12,
  football: 11,
  padel: 4,
  'table-tennis': 4,
  basketball: 10,
  badminton: 4,
};

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 30;

export default function CreateMatchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { createMatch } = useMatches();

  const areas = useMemo(allAreas, []);
  const openSlots = useMemo(
    () => slots.filter((slot) => slot.status === 'available'),
    [],
  );

  const [sportId, setSportId] = useState(sports[0]?.id ?? 'cricket');
  const [title, setTitle] = useState('');
  const [areaIndex, setAreaIndex] = useState(() => {
    // Default to the host's home area when it matches a known one.
    const found = areas.findIndex(
      ({ city, area }) => `${area.name}, ${city.name}` === session?.homeArea,
    );
    return found >= 0 ? found : 0;
  });
  const [dateId, setDateId] = useState(bookingDates[0]?.id ?? '');
  const [slotId, setSlotId] = useState(openSlots[0]?.id ?? '');
  const [skill, setSkill] = useState(SKILL_LEVELS[1]!);
  const [players, setPlayers] = useState(String(SQUAD_PRESETS[sportId] ?? 10));
  const [hostPlaying, setHostPlaying] = useState(true);
  const [saving, setSaving] = useState(false);

  const sport = getSport(sportId);
  const slot = openSlots.find((s) => s.id === slotId);
  const date = bookingDates.find((d) => d.id === dateId);
  const picked = areas[areaIndex];

  const playerCount = Number(players);
  const playersValid =
    Number.isInteger(playerCount) &&
    playerCount >= MIN_PLAYERS &&
    playerCount <= MAX_PLAYERS;

  // Ground cost splits across everyone expected to play, so the per-head
  // figure is what hosts actually advertise.
  const groundPrice = slot?.price ?? 0;
  const perPlayer = playersValid
    ? Math.ceil(groundPrice / playerCount)
    : 0;

  const trimmedTitle = title.trim();
  const ready = trimmedTitle.length >= 3 && playersValid && Boolean(slot);

  // Changing sport re-suggests the squad size, but never overwrites a number
  // the host has already deviated from.
  const pickSport = (id: string) => {
    const previousDefault = String(SQUAD_PRESETS[sportId] ?? 10);
    setSportId(id);
    if (players === previousDefault) {
      setPlayers(String(SQUAD_PRESETS[id] ?? 10));
    }
  };

  const submit = () => {
    if (!ready || saving) return;
    setSaving(true);
    const match = createMatch({
      sportId,
      title: trimmedTitle,
      area: picked ? `${picked.area.name}, ${picked.city.name}` : '',
      time: `${date?.label ?? 'Today'}, ${slot?.time ?? ''}`,
      pricePerPlayer: perPlayer,
      skillLevel: skill,
      playersNeeded: playerCount,
      hostPlaying,
    });
    navigation.replace('MatchCreated', { matchId: match.id });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Create a match"
        subtitle="Fill your ground with players"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing['4xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Sport</Text>
          <View style={styles.wrap}>
            {sports.map((item) => {
              const selected = item.id === sportId;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => pickSport(item.id)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.chipEmoji}>{item.emoji}</Text>
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.field}>
            <Input
              label="Match title"
              value={title}
              onChangeText={setTitle}
              placeholder={`e.g. Evening ${sport?.name ?? 'game'} at DHA`}
              autoCapitalize="sentences"
              maxLength={50}
            />
          </View>

          <Text style={styles.label}>Area</Text>
          <View style={styles.wrap}>
            {areas.map(({ city, area }, index) => {
              const selected = index === areaIndex;
              return (
                <Pressable
                  key={`${city.id}-${area.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setAreaIndex(index)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {area.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
          >
            {bookingDates.map((item) => {
              const selected = item.id === dateId;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setDateId(item.id)}
                  style={({ pressed }) => [
                    styles.dateCell,
                    selected && styles.dateCellSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateLabel,
                      selected && styles.dateTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.dateDay, selected && styles.dateTextSelected]}
                  >
                    {item.day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Time</Text>
          <View style={styles.wrap}>
            {openSlots.map((item) => {
              const selected = item.id === slotId;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSlotId(item.id)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {item.time}
                  </Text>
                  {item.peak ? (
                    <View
                      style={[styles.peak, selected && styles.peakSelected]}
                    >
                      <Text
                        style={[
                          styles.peakText,
                          selected && styles.peakTextSelected,
                        ]}
                      >
                        Peak
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Players needed</Text>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="One fewer player"
              onPress={() =>
                setPlayers((p) => String(Math.max(MIN_PLAYERS, Number(p) - 1)))
              }
              disabled={playerCount <= MIN_PLAYERS}
              style={({ pressed }) => [
                styles.stepBtn,
                playerCount <= MIN_PLAYERS && styles.stepBtnDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </Pressable>

            <TextInput
              value={players}
              onChangeText={(text) =>
                setPlayers(text.replace(/\D/g, '').slice(0, 2))
              }
              keyboardType="number-pad"
              style={styles.stepValue}
              maxLength={2}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="One more player"
              onPress={() =>
                setPlayers((p) => String(Math.min(MAX_PLAYERS, Number(p) + 1)))
              }
              disabled={playerCount >= MAX_PLAYERS}
              style={({ pressed }) => [
                styles.stepBtn,
                playerCount >= MAX_PLAYERS && styles.stepBtnDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </Pressable>
          </View>
          {!playersValid ? (
            <Text style={styles.errorText}>
              Enter a squad size between {MIN_PLAYERS} and {MAX_PLAYERS}.
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: hostPlaying }}
            onPress={() => setHostPlaying((v) => !v)}
            style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          >
            <View
              style={[styles.check, hostPlaying && styles.checkOn]}
            >
              {hostPlaying ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : null}
            </View>
            <Text style={styles.toggleText}>I'm playing in this match</Text>
          </Pressable>

          <Text style={styles.label}>Skill level</Text>
          <View style={styles.wrap}>
            {SKILL_LEVELS.map((level) => {
              const selected = level === skill;
              return (
                <Pressable
                  key={level}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSkill(level)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {level}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Cost summary — the split is derived, never typed, so it always
              matches the slot price and squad size above. */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ground cost</Text>
              <Text style={styles.summaryValue}>{formatPkr(groundPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Split between</Text>
              <Text style={styles.summaryValue}>
                {playersValid ? `${playerCount} players` : '—'}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Each player pays</Text>
              <Text style={styles.summaryTotal}>
                {playersValid ? formatPkr(perPlayer) : '—'}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              label="Publish match"
              onPress={submit}
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
  content: { paddingHorizontal: screenPadding },
  pressed: { opacity: 0.7 },

  label: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  field: { marginTop: spacing.xl },

  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm, paddingRight: screenPadding },
  chip: {
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
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipEmoji: { fontSize: fontSize.footnote },
  chipText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  chipTextSelected: { color: colors.white, fontWeight: fontWeight.bold },
  peak: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
  },
  peakSelected: { backgroundColor: colors.primaryDark },
  peakText: {
    fontSize: fontSize.badge,
    lineHeight: leading(fontSize.badge, 1.6),
    fontWeight: fontWeight.bold,
    color: colors.accentDark,
  },
  peakTextSelected: { color: colors.white },

  dateCell: {
    minWidth: 58,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  dateCellSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateLabel: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  dateDay: {
    fontSize: fontSize.callout,
    lineHeight: leading(fontSize.callout, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  dateTextSelected: { color: colors.white },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'flex-start',
    padding: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepValue: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: fontSize.sectionTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    padding: 0,
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.error,
  },

  toggle: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },

  summary: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },
  summaryValue: {
    flexShrink: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    marginVertical: spacing.sm,
    backgroundColor: colors.borderSubtle,
  },
  summaryTotalLabel: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  summaryTotal: {
    flexShrink: 0,
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },

  actions: { marginTop: spacing.xl },
});
