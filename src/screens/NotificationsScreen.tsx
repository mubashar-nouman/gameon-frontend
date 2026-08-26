import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FadeInView } from '../components/ui';
import { notifications, type AppNotification } from '../data';
import type { DiscoverStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Notifications'>;

const ICONS: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; fg: string; bg: string }
> = {
  booking: { icon: 'calendar', fg: colors.primaryDark, bg: colors.primarySoft },
  match: { icon: 'people', fg: colors.accentDark, bg: colors.accentSoft },
  reminder: { icon: 'alarm', fg: colors.muted, bg: colors.pageBackground },
  social: { icon: 'star', fg: colors.accentDark, bg: colors.accentSoft },
};

export default function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [readIds, setReadIds] = useState<string[]>([]);

  const items = useMemo(
    () =>
      notifications.map((item) => ({
        ...item,
        read: item.read || readIds.includes(item.id),
      })),
    [readIds],
  );

  const unread = items.filter((item) => !item.read).length;

  const markAllRead = () =>
    setReadIds(notifications.map((item) => item.id));

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>Notifications</Text>
          {unread > 0 ? (
            <Text style={styles.subtitle}>{unread} unread</Text>
          ) : null}
        </View>

        {unread > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={markAllRead}
            hitSlop={8}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Text style={styles.markAll}>Mark all</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item: AppNotification) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-outline"
                size={26}
                color={colors.muted}
              />
            </View>
            <Text style={styles.emptyTitle}>Nothing yet</Text>
            <Text style={styles.emptyBody}>
              Booking updates and match requests will appear here.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const meta = ICONS[item.type] ?? ICONS.reminder;
          return (
            <FadeInView delay={Math.min(index, 5) * 35}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  setReadIds((prev) =>
                    prev.includes(item.id) ? prev : [...prev, item.id],
                  )
                }
                style={({ pressed }) => [
                  styles.row,
                  !item.read && styles.rowUnread,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.icon, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={17} color={meta.fg} />
                </View>

                <View style={styles.body}>
                  <Text
                    style={[styles.rowTitle, !item.read && styles.rowTitleUnread]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.rowBody} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text style={styles.rowTime}>{item.time}</Text>
                </View>

                {!item.read ? <View style={styles.unreadDot} /> : null}
              </Pressable>
            </FadeInView>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backBtn: {
    width: 38,
    height: 38,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 19,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  title: {
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  markAll: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  pressed: { opacity: 0.65 },

  list: { padding: screenPadding, gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rowUnread: { borderColor: colors.primary },
  icon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  rowTitleUnread: { fontWeight: fontWeight.bold },
  rowBody: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  rowTime: {
    marginTop: spacing.sm,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 4,
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
  },

  empty: {
    marginTop: spacing['3xl'],
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
