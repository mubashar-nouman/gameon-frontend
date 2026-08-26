import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge, Card, Thumbnail } from '../components/ui';
import { bookings, formatPkr } from '../data';
import { colors } from '../theme/colors';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: TAB_BAR_CLEARANCE + insets.bottom,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={28} color={colors.muted} />
          <Text style={styles.emptyText}>No bookings yet.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {bookings.map((booking) => (
            <Card key={booking.id} style={styles.card}>
              <Thumbnail icon="football-outline" size={56} />
              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>
                  {booking.arenaName}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {booking.date} · {booking.time} · {booking.area}
                </Text>
                <View style={styles.footer}>
                  <Text style={styles.price} numberOfLines={1}>
                    {formatPkr(booking.price)}
                  </Text>
                  <Badge
                    label={booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    tone={booking.status === 'confirmed' ? 'positive' : 'attention'}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: {},
  title: {
    paddingHorizontal: screenPadding,
    fontSize: fontSize.screenTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  list: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  body: { flex: 1 },
  name: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  empty: {
    paddingTop: spacing['4xl'],
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: { fontSize: fontSize.body, color: colors.muted },
});
