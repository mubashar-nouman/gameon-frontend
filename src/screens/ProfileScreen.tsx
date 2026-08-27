import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { profile, unreadCount } from '../data';
import type { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = StackScreenProps<ProfileStackParamList, 'ProfileHome'>;

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

/** Every row navigates, so the id is a real route — no cast at the call site. */
type MenuItem = {
  id: Exclude<keyof ProfileStackParamList, 'ProfileHome'>;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const APP_ITEMS: MenuItem[] = [
  { id: 'Notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'Help', label: 'Help and support', icon: 'help-circle-outline' },
  { id: 'About', label: 'About GameOn', icon: 'information-circle-outline' },
];

export default function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const reliability = Math.round(
    (profile.matchesCompleted / profile.matchesPlayed) * 100,
  );
  const unread = unreadCount();

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
      <Text style={styles.title}>Profile</Text>

      {/* Identity — the pencil is the only route into editing. */}
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
        </View>

        <View style={styles.identityText}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.handle} numberOfLines={1}>
            {profile.handle} · {profile.memberSince}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.accent} />
            <Text style={styles.ratingValue}>{profile.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount} numberOfLines={1}>
              ({profile.ratingCount} ratings)
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          onPress={() => navigation.navigate('EditProfile')}
          hitSlop={8}
          style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
        >
          <Ionicons name="create-outline" size={18} color={colors.primaryDark} />
        </Pressable>
      </View>

      {/* Reputation — the trust signal Idea.md §6 calls for. */}
      <View style={styles.statRow}>
        <Stat value={String(profile.matchesPlayed)} label="Played" />
        <View style={styles.statDivider} />
        <Stat value={`${reliability}%`} label="Show-up rate" />
        <View style={styles.statDivider} />
        <Stat value={String(profile.cancellations)} label="Cancelled" />
      </View>

      <Text style={styles.sectionLabel}>App</Text>
      <View style={styles.group}>
        {APP_ITEMS.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => navigation.navigate(item.id)}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.rowDivided,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.rowIcon}>
              <Ionicons name={item.icon} size={18} color={colors.muted} />
            </View>
            <Text style={styles.rowLabel}>{item.label}</Text>
            {item.id === 'Notifications' && unread > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            ) : null}
            <Ionicons name="chevron-forward" size={17} color={colors.border} />
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>

      <Text style={styles.version}>GameOn · v1.0.0</Text>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  pressed: { opacity: 0.7 },

  identity: {
    marginTop: spacing.lg,
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatar: {
    width: 58,
    height: 58,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  identityText: { flex: 1, minWidth: 0 },
  name: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  handle: {
    marginTop: 2,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  ratingRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingValue: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  ratingCount: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  editBtn: {
    width: 36,
    height: 36,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statRow: {
    marginTop: spacing.md,
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs, minWidth: 0 },
  statValue: {
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  statDivider: { width: 1, height: 32, backgroundColor: colors.borderSubtle },

  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    paddingHorizontal: screenPadding,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  group: {
    marginHorizontal: screenPadding,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowDivided: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  badge: {
    minWidth: 20,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: fontSize.badge,
    lineHeight: leading(fontSize.badge, 1.6),
    fontWeight: fontWeight.bold,
    color: colors.white,
  },

  signOut: {
    marginTop: spacing.xl,
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  signOutText: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.error,
  },
  version: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
});
