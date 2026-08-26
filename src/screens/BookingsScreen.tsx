import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BookingCard from '../components/bookings/BookingCard';
import SegmentedTabs, {
  type Segment,
} from '../components/matches/SegmentedTabs';
import { FadeInView } from '../components/ui';
import { bookings, formatPkr, isUpcoming, type Booking } from '../data';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const upcoming = useMemo(
    () =>
      bookings
        .filter(isUpcoming)
        .sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    [],
  );

  const past = useMemo(
    () =>
      bookings
        .filter((booking) => !isUpcoming(booking))
        // Most recent first — history reads backwards from now.
        .sort((a, b) => b.isoDate.localeCompare(a.isoDate)),
    [],
  );

  const visible = tab === 'upcoming' ? upcoming : past;

  const segments: Segment[] = [
    { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { id: 'past', label: 'Past', count: past.length },
  ];

  const nextUp = upcoming[0];
  const totalSpent = past
    .filter((booking) => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.price, 0);

  const onRefresh = () => {
    setRefreshing(true);
    // Placeholder until a real data layer exists.
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: TAB_BAR_CLEARANCE + insets.bottom,
        },
      ]}
      data={visible}
      keyExtractor={(item: Booking) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Bookings</Text>
          <Text style={styles.subtitle}>
            {tab === 'upcoming'
              ? 'Games you have booked'
              : `${formatPkr(totalSpent)} spent on ${
                  past.filter((b) => b.status === 'completed').length
                } games`}
          </Text>

          {/* Next-up strip: the one booking that needs attention today. */}
          {tab === 'upcoming' && nextUp ? (
            <FadeInView style={styles.nextUp}>
              <View style={styles.nextIcon}>
                <Ionicons name="flash" size={16} color={colors.white} />
              </View>
              <View style={styles.nextText}>
                <Text style={styles.nextLabel}>Next up</Text>
                <Text style={styles.nextValue} numberOfLines={1}>
                  {nextUp.arenaName} · {nextUp.date}
                </Text>
              </View>
              <Text style={styles.nextTime} numberOfLines={1}>
                {nextUp.time.split('–')[0].trim()}
              </Text>
            </FadeInView>
          ) : null}

          <View style={styles.tabs}>
            <SegmentedTabs
              segments={segments}
              selectedId={tab}
              onSelect={setTab}
            />
          </View>
        </View>
      }
      ListEmptyComponent={
        <FadeInView style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name={tab === 'upcoming' ? 'calendar-outline' : 'time-outline'}
              size={26}
              color={colors.muted}
            />
          </View>
          <Text style={styles.emptyTitle}>
            {tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
          </Text>
          <Text style={styles.emptyBody}>
            {tab === 'upcoming'
              ? 'Find a ground and book your next game.'
              : 'Games you have played will appear here.'}
          </Text>
        </FadeInView>
      }
      renderItem={({ item, index }) => (
        <FadeInView delay={Math.min(index, 4) * 40} style={styles.item}>
          <BookingCard booking={item} />
        </FadeInView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: {},
  title: {
    paddingHorizontal: screenPadding,
    fontSize: fontSize.screenTitle,
    lineHeight: leading(fontSize.screenTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    paddingHorizontal: screenPadding,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },

  nextUp: {
    marginTop: spacing.lg,
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  nextIcon: {
    width: 34,
    height: 34,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { flex: 1, minWidth: 0 },
  nextLabel: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },
  nextValue: {
    marginTop: 2,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  nextTime: {
    flexShrink: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },

  tabs: { paddingHorizontal: screenPadding, marginTop: spacing.lg },
  item: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
  },

  empty: {
    marginTop: spacing['3xl'],
    paddingHorizontal: screenPadding,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyBody: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
    textAlign: 'center',
  },
});
