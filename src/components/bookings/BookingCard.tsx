import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import SportArt from '../art/SportArt';
import { getArenaImage } from '../../data/arenaImages';
import { formatPkr, getSport, type Booking } from '../../data';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = {
  booking: Booking;
  onPress?: () => void;
  onCancel?: () => void;
  onRebook?: () => void;
};

const STATUS: Record<
  string,
  { label: string; fg: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  confirmed: {
    label: 'Confirmed',
    fg: colors.primaryDark,
    bg: colors.primarySoft,
    icon: 'checkmark-circle',
  },
  pending: {
    label: 'Awaiting owner',
    fg: colors.accentDark,
    bg: colors.accentSoft,
    icon: 'time',
  },
  completed: {
    label: 'Played',
    fg: colors.muted,
    bg: colors.pageBackground,
    icon: 'checkmark-done',
  },
  cancelled: {
    label: 'Cancelled',
    fg: colors.error,
    bg: colors.errorSoft,
    icon: 'close-circle',
  },
};

export default function BookingCard({
  booking,
  onPress,
  onCancel,
  onRebook,
}: Props) {
  const sport = getSport(booking.sportId);
  const variant = Number(booking.arenaId.replace(/\D/g, '')) || 0;
  const photo = getArenaImage(booking.sportId, variant);
  const status = STATUS[booking.status] ?? STATUS.confirmed;
  const isPast = booking.status === 'completed' || booking.status === 'cancelled';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${booking.arenaName}, ${booking.date}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.media}>
          {photo ? (
            <Image source={photo} style={styles.art} resizeMode="cover" />
          ) : (
            <SportArt sportId={booking.sportId} style={styles.art} />
          )}
        </View>

        <View style={styles.info}>
          <View
            style={[styles.statusPill, { backgroundColor: status.bg }]}
          >
            <Ionicons name={status.icon} size={11} color={status.fg} />
            <Text style={[styles.statusText, { color: status.fg }]}>
              {status.label}
            </Text>
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {booking.arenaName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {sport?.name} · {booking.area}
          </Text>
        </View>
      </View>

      <View style={styles.when}>
        <View style={styles.whenItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.muted} />
          <Text style={styles.whenText}>{booking.date}</Text>
        </View>
        <View style={styles.whenDivider} />
        <View style={styles.whenItem}>
          <Ionicons name="time-outline" size={14} color={colors.muted} />
          <Text style={styles.whenText} numberOfLines={1}>
            {booking.time}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceBlock}>
          <Text style={styles.price} numberOfLines={1}>
            {formatPkr(booking.price)}
          </Text>
          <Text style={styles.reference}>{booking.reference}</Text>
        </View>

        {isPast ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Book ${booking.arenaName} again`}
            onPress={onRebook}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <Text style={styles.actionText}>Book again</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel booking"
            onPress={onCancel}
            style={({ pressed }) => [
              styles.action,
              styles.actionDanger,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.actionText, styles.actionTextDanger]}>
              Cancel
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: { opacity: 0.9 },

  top: { flexDirection: 'row', gap: spacing.md },
  media: { width: 72, height: 72 },
  art: { width: 72, height: 72, borderRadius: radius.md },
  info: { flex: 1, justifyContent: 'center' },

  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
  },
  name: {
    marginTop: spacing.sm,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

  when: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.pageBackground,
  },
  whenItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 0,
  },
  whenText: {
    flexShrink: 1,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  whenDivider: { width: 1, height: 16, backgroundColor: colors.border },

  footer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  priceBlock: { flexShrink: 1, minWidth: 0 },
  price: {
    fontSize: fontSize.callout,
    lineHeight: leading(fontSize.callout, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  reference: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  action: {
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionDanger: { borderColor: colors.border },
  actionText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  actionTextDanger: { color: colors.muted },
});
