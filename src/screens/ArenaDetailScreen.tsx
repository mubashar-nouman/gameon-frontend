import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BookingConfirmSheet from '../components/arena/BookingConfirmSheet';
import SportArt from '../components/art/SportArt';
import { Button } from '../components/ui';
import { getArenaImage } from '../data/arenaImages';
import {
  arenas,
  bookingDates,
  formatPkr,
  getArenaDetail,
  getReviews,
  getSport,
  slots,
  type Slot,
} from '../data';
import type { DiscoverStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { elevation } from '../theme/elevation';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'ArenaDetail'>;

const HERO_HEIGHT = 260;

export default function ArenaDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const arena = arenas.find((a) => a.id === route.params.arenaId);

  const [selectedDate, setSelectedDate] = useState(bookingDates[0].id);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  const similar = useMemo(
    () =>
      arena
        ? arenas
            .filter((a) => a.sportId === arena.sportId && a.id !== arena.id)
            .slice(0, 4)
        : [],
    [arena],
  );

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

  const sport = getSport(arena.sportId);
  const detail = getArenaDetail(arena.id);
  const arenaReviews = getReviews(arena.id);
  const variant = Number(arena.id.replace(/\D/g, '')) || 0;
  const photo = getArenaImage(arena.sportId, variant);
  const dateLabel =
    bookingDates.find((d) => d.id === selectedDate)?.label ?? 'Today';
  const openSlots = slots.filter((slot) => slot.status !== 'booked').length;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {photo ? (
            <Image source={photo} style={styles.heroArt} resizeMode="cover" />
          ) : (
            <SportArt sportId={arena.sportId} style={styles.heroArt} />
          )}

          <View style={[styles.heroBar, { top: insets.top + spacing.sm }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => navigation.goBack()}
              style={styles.heroBtn}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from saved' : 'Save arena'}
              onPress={() => setSaved((prev) => !prev)}
              style={styles.heroBtn}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={20}
                color={saved ? colors.primary : colors.text}
              />
            </Pressable>
          </View>

          <View style={styles.sportTag}>
            <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
            <Text style={styles.sportName}>{sport?.name}</Text>
          </View>
        </View>

        {/* Identity */}
        <View style={styles.section}>
          <Text style={styles.name}>{arena.name}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.rating}>{arena.rating.toFixed(1)}</Text>
            <Text style={styles.meta}>
              ({arena.reviewCount} reviews) · {arena.area} · {arena.distanceKm} km
            </Text>
          </View>

          <View style={styles.statRow}>
            <Stat
              icon="grid-outline"
              label={`${arena.grounds} ${
                arena.grounds === 1 ? 'ground' : 'grounds'
              }`}
            />
            <View style={styles.statDivider} />
            <Stat icon="time-outline" label={arena.activeWindow} />
            <View style={styles.statDivider} />
            <Stat icon="cash-outline" label={`${formatPkr(arena.pricePerHour)}/hr`} />
          </View>
        </View>

        {/* Facilities */}
        <View style={styles.section}>
          <Text style={styles.heading}>Facilities</Text>
          <View style={styles.facilityGrid}>
            {arena.facilities.map((facility) => (
              <View key={facility} style={styles.facility}>
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={colors.primary}
                />
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Slot picker */}
        <View style={[styles.section, styles.bookingSection]}>
          <View style={styles.headingRow}>
            <Text style={styles.heading}>Pick a slot</Text>
            <View style={styles.availPill}>
              <View style={styles.availDot} />
              <Text style={styles.availText}>
                {openSlots} of {slots.length} free
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroller}
            contentContainerStyle={styles.dateRow}
          >
            {bookingDates.map((date) => {
              const active = date.id === selectedDate;
              return (
                <Pressable
                  key={date.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    setSelectedDate(date.id);
                    setSelectedSlot(null);
                  }}
                  style={[styles.date, active && styles.dateActive]}
                >
                  <Text style={[styles.dateLabel, active && styles.onPrimary]}>
                    {date.label}
                  </Text>
                  <Text style={[styles.dateDay, active && styles.onPrimary]}>
                    {date.day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.slotGrid}>
            {slots.map((slot) => {
              const isBooked = slot.status === 'booked';
              const active = selectedSlot?.id === slot.id;
              return (
                <Pressable
                  key={slot.id}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isBooked, selected: active }}
                  disabled={isBooked}
                  onPress={() => setSelectedSlot(slot)}
                  style={[
                    styles.slot,
                    isBooked && styles.slotBooked,
                    active && styles.slotActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotTime,
                      isBooked && styles.slotTimeBooked,
                      active && styles.onPrimary,
                    ]}
                  >
                    {slot.time}
                  </Text>
                  <Text
                    style={[styles.slotMeta, active && styles.onPrimary]}
                  >
                    {isBooked ? 'Booked' : formatPkr(slot.price)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.heading}>About</Text>
          <Text style={styles.body}>{detail.about}</Text>
        </View>

        {/* Hours */}
        <View style={styles.section}>
          <Text style={styles.heading}>Opening hours</Text>
          <View style={styles.card}>
            {detail.hours.map((entry, index) => (
              <View
                key={entry.day}
                style={[styles.hourRow, index > 0 && styles.hourRowDivided]}
              >
                <Text style={styles.hourDay}>{entry.day}</Text>
                <Text style={styles.hourTime}>{entry.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <Text style={styles.heading}>Ground rules</Text>
          {detail.rules.map((rule) => (
            <View key={rule} style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.headingRow}>
            <Text style={styles.heading}>Reviews</Text>
            {arenaReviews.length > 0 ? (
              <Text style={styles.headingMeta}>
                {arena.rating.toFixed(1)} · {arena.reviewCount}
              </Text>
            ) : null}
          </View>

          {arenaReviews.length > 0 ? (
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingBig}>{arena.rating.toFixed(1)}</Text>
              <View style={styles.ratingStars}>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Ionicons
                      key={n}
                      name={n <= Math.round(arena.rating) ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.accent}
                    />
                  ))}
                </View>
                <Text style={styles.ratingCount}>
                  Based on {arena.reviewCount} reviews
                </Text>
              </View>
            </View>
          ) : null}

          {arenaReviews.length === 0 ? (
            <Text style={styles.body}>
              No reviews yet. Be the first to play here and leave one.
            </Text>
          ) : (
            arenaReviews.map((review) => (
              <View key={review.id} style={styles.review}>
                <View style={styles.reviewHead}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.author.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.reviewWho}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    <Ionicons name="star" size={12} color={colors.accent} />
                    <Text style={styles.reviewRating}>{review.rating}.0</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))
          )}
        </View>

        {/* Similar */}
        {similar.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Similar grounds</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarRow}
            >
              {similar.map((item) => {
                const itemVariant = Number(item.id.replace(/\D/g, '')) || 0;
                const itemPhoto = getArenaImage(item.sportId, itemVariant);
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    onPress={() =>
                      navigation.push('ArenaDetail', { arenaId: item.id })
                    }
                    style={styles.similarCard}
                  >
                    {itemPhoto ? (
                      <Image
                        source={itemPhoto}
                        style={styles.similarArt}
                        resizeMode="cover"
                      />
                    ) : (
                      <SportArt
                        sportId={item.sportId}
                        style={styles.similarArt}
                      />
                    )}
                    <Text style={styles.similarName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.similarMeta} numberOfLines={1}>
                      {formatPkr(item.pricePerHour)}/hr · {item.distanceKm} km
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky booking bar */}
      <View
        style={[styles.bookBar, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <View style={styles.bookInfo}>
          {selectedSlot ? (
            <>
              <Text style={styles.bookMeta}>
                {dateLabel} · {selectedSlot.time}
              </Text>
              <Text style={styles.bookPrice} numberOfLines={1}>
                {formatPkr(selectedSlot.price)}
                <Text style={styles.bookPer}> · 60 min</Text>
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.bookMeta}>From</Text>
              <Text style={styles.bookPrice} numberOfLines={1}>
                {formatPkr(arena.pricePerHour)}
                <Text style={styles.bookPer}> / hr</Text>
              </Text>
            </>
          )}
        </View>

        <Button
          label={booked ? 'Requested' : 'Book slot'}
          disabled={!selectedSlot || booked}
          onPress={() => setConfirmOpen(true)}
          style={styles.bookCta}
        />
      </View>

      <BookingConfirmSheet
        visible={confirmOpen}
        arena={arena}
        slot={selectedSlot}
        dateLabel={dateLabel}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setBooked(true);
        }}
      />
    </View>
  );
}

function Stat({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={15} color={colors.muted} />
      <Text style={styles.statText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: {},

  hero: { height: HERO_HEIGHT, backgroundColor: colors.border },
  heroArt: { width: '100%', height: HERO_HEIGHT },
  heroBar: {
    position: 'absolute',
    left: screenPadding,
    right: screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroBtn: {
    width: 40,
    height: 40,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.soft,
  },
  sportTag: {
    position: 'absolute',
    left: screenPadding,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    ...elevation.soft,
  },
  sportEmoji: { fontSize: fontSize.caption },
  sportName: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  section: {
    marginTop: spacing.xl,
    paddingHorizontal: screenPadding,
  },
  name: {
    fontSize: fontSize.screenTitle,
    lineHeight: leading(fontSize.screenTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  meta: {
    flex: 1,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },

  statRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  statDivider: { width: 1, height: 28, backgroundColor: colors.borderSubtle },

  bookingSection: {
    marginHorizontal: screenPadding,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  availDot: {
    width: 6,
    height: 6,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  availText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },
  ratingSummary: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  ratingBig: {
    fontSize: fontSize.statHero,
    lineHeight: leading(fontSize.statHero, 1.2),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  ratingStars: { flex: 1, gap: spacing.xs },
  starRow: { flexDirection: 'row', gap: 2 },
  ratingCount: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  heading: {
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingMeta: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.muted,
  },
  body: {
    marginTop: spacing.sm,
    fontSize: fontSize.body,
    lineHeight: leading(fontSize.body),
    color: colors.muted,
  },

  facilityGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  facilityText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },

  dateScroller: { flexGrow: 0, marginTop: spacing.md },
  dateRow: { gap: spacing.sm, paddingVertical: spacing.xs },
  date: {
    width: 62,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateLabel: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  dateDay: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  onPrimary: { color: colors.white },

  slotGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    flexGrow: 1,
    flexBasis: '30%',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: spacing.xs,
  },
  slotBooked: { backgroundColor: colors.pageBackground },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotTime: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  slotTimeBooked: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  slotMeta: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

  card: {
    marginTop: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md,
  },
  hourRowDivided: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  hourDay: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },
  hourTime: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },

  ruleRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  ruleDot: {
    width: 5,
    height: 5,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 2.5,
    marginTop: 7,
    backgroundColor: colors.primary,
  },
  ruleText: {
    flex: 1,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },

  review: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 34,
    height: 34,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },
  reviewWho: { flex: 1 },
  reviewAuthor: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  reviewDate: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  reviewStars: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  reviewRating: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  reviewText: {
    marginTop: spacing.md,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },

  similarRow: { gap: spacing.md, paddingTop: spacing.md, paddingVertical: spacing.xs },
  similarCard: { width: 150 },
  similarArt: {
    width: 150,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  similarName: {
    marginTop: spacing.sm,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  similarMeta: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

  bookBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  bookInfo: { flex: 1, minWidth: 0 },
  bookMeta: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  bookPrice: {
    flexShrink: 1,
    marginTop: 2,
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  bookPer: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    color: colors.muted,
  },
  bookCta: { flexShrink: 0, minWidth: 132 },

  missing: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  missingText: {
    fontSize: fontSize.body,
    lineHeight: leading(fontSize.body),
    color: colors.muted,
  },
});
