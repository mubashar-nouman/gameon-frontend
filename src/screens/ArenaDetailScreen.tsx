import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Badge, Button } from '../components/ui';
import {
  arenas,
  bookingDates,
  formatPkr,
  slots,
  type Slot,
} from '../data';
import type { DiscoverStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'ArenaDetail'>;

export default function ArenaDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const arena = arenas.find((a) => a.id === route.params.arenaId);

  const [selectedDate, setSelectedDate] = useState(bookingDates[0].id);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  if (!arena) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingText}>This ground is no longer listed.</Text>
        <Button
          label="Go back"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.image}>
          <Ionicons name="image-outline" size={32} color={colors.muted} />
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{arena.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color={colors.text} />
            <Text style={styles.metaStrong}>{arena.rating.toFixed(1)}</Text>
            <Text style={styles.meta}>
              ({arena.reviewCount}) · {arena.area} · {arena.distanceKm} km
            </Text>
          </View>

          <View style={styles.facilities}>
            {arena.facilities.map((facility) => (
              <Badge key={facility} label={facility} tone="neutral" />
            ))}
          </View>

          <View style={styles.slotHeader}>
            <Text style={styles.sectionTitle}>Pick a slot</Text>
            <Text style={styles.court}>{`${arena.grounds > 1 ? 'Ground A' : 'Main ground'}`}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}
          >
            {bookingDates.map((date) => {
              const active = date.id === selectedDate;
              return (
                <Pressable
                  key={date.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setSelectedDate(date.id)}
                  style={[styles.date, active ? styles.dateActive : null]}
                >
                  <Text
                    style={[styles.dateLabel, active ? styles.onPrimary : null]}
                  >
                    {date.label}
                  </Text>
                  <Text
                    style={[styles.dateDay, active ? styles.onPrimary : null]}
                  >
                    {date.day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.slotGrid}>
            {slots.map((slot) => {
              const booked = slot.status === 'booked';
              const active = selectedSlot?.id === slot.id;
              return (
                <Pressable
                  key={slot.id}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: booked, selected: active }}
                  disabled={booked}
                  onPress={() => setSelectedSlot(slot)}
                  style={[
                    styles.slot,
                    booked ? styles.slotBooked : null,
                    active ? styles.slotActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotTime,
                      booked ? styles.slotTimeBooked : null,
                      active ? styles.onPrimary : null,
                    ]}
                  >
                    {slot.time}
                  </Text>
                  <Text
                    style={[
                      styles.slotMeta,
                      active ? styles.onPrimary : null,
                    ]}
                  >
                    {booked ? 'Booked' : formatPkr(slot.price)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.note}>
            Peak is 8 to 10 PM. The owner confirms within 15 minutes.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View>
          <Text style={styles.footerMeta}>
            {selectedSlot ? `${selectedSlot.time} · 60 min` : 'No slot selected'}
          </Text>
          <Text style={styles.footerPrice}>
            {selectedSlot ? formatPkr(selectedSlot.price) : '—'}
          </Text>
        </View>
        <Button
          label="Book this slot"
          disabled={!selectedSlot}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: { paddingBottom: spacing['4xl'] },
  image: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: screenPadding },
  name: {
    fontSize: fontSize.screenTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaStrong: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  meta: { flex: 1, fontSize: fontSize.footnote, color: colors.muted },
  facilities: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotHeader: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: fontSize.sectionTitle,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  court: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  dateRow: { paddingTop: spacing.md, gap: spacing.sm },
  date: {
    width: 64,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateLabel: { fontSize: fontSize.caption, color: colors.muted },
  dateDay: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  onPrimary: { color: colors.white },
  slotGrid: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  slot: {
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: 64,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  slotBooked: { backgroundColor: colors.backgroundSecondary },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotTime: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  slotTimeBooked: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  slotMeta: { fontSize: fontSize.caption, color: colors.muted },
  note: {
    marginTop: spacing.lg,
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.white,
  },
  footerMeta: { fontSize: fontSize.footnote, color: colors.muted },
  footerPrice: {
    marginTop: spacing.xs,
    fontSize: fontSize.screenTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  cta: { flex: 1, maxWidth: 200 },
  missing: {
    flex: 1,
    padding: screenPadding,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  missingText: { fontSize: fontSize.body, color: colors.muted },
});
