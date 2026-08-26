import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSport, profile } from '../data';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  hint?: string;
};

const ACCOUNT: MenuItem[] = [
  { id: 'edit', label: 'Edit profile', icon: 'person-outline' },
  { id: 'sports', label: 'Preferred sports', icon: 'football-outline', hint: '2' },
  { id: 'payments', label: 'Payment methods', icon: 'card-outline' },
];

const APP: MenuItem[] = [
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'help', label: 'Help and support', icon: 'help-circle-outline' },
  { id: 'about', label: 'About GameOn', icon: 'information-circle-outline' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const reliability = Math.round(
    (profile.matchesCompleted / profile.matchesPlayed) * 100,
  );

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

      {/* Identity */}
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name.charAt(0)}
          </Text>
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
            <Text style={styles.ratingCount}>
              ({profile.ratingCount} ratings)
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
        >
          <Ionicons name="create-outline" size={18} color={colors.text} />
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

      {/* Preferred sports */}
      <Text style={styles.sectionLabel}>Preferred sports</Text>
      <View style={styles.sportRow}>
        {profile.preferredSports.map((entry) => {
          const sport = getSport(entry.sportId);
          return (
            <View key={entry.sportId} style={styles.sportChip}>
              <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
              <View>
                <Text style={styles.sportName}>{sport?.name}</Text>
                <Text style={styles.sportLevel}>{entry.level}</Text>
              </View>
            </View>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add sport"
          style={({ pressed }) => [styles.addSport, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>Account</Text>
      <MenuGroup items={ACCOUNT} />

      <Text style={styles.sectionLabel}>App</Text>
      <MenuGroup items={APP} />

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

function MenuGroup({ items }: { items: MenuItem[] }) {
  return (
    <View style={styles.group}>
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
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
          {item.hint ? <Text style={styles.rowHint}>{item.hint}</Text> : null}
          <Ionicons name="chevron-forward" size={17} color={colors.border} />
        </Pressable>
      ))}
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
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  editBtn: {
    width: 36,
    height: 36,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 18,
    backgroundColor: colors.pageBackground,
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

  sportRow: {
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sportEmoji: { fontSize: fontSize.callout },
  sportName: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  sportLevel: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  addSport: {
    width: 44,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  rowHint: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
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
