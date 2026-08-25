import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, ListRow } from '../components/ui';
import { colors } from '../theme/colors';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

const menu = [
  { id: 'sports', label: 'Preferred sports', icon: 'football-outline' },
  { id: 'payments', label: 'Payment methods', icon: 'card-outline' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'help', label: 'Help and support', icon: 'help-circle-outline' },
] as const;

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

export default function ProfileScreen() {
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
      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Card style={styles.identity}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={24} color={colors.muted} />
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>Sign in to GameOn</Text>
            <Text style={styles.meta}>
              Save bookings and join open matches
            </Text>
          </View>
        </Card>

        <Button label="Sign in" style={styles.signIn} />
      </View>

      <View style={styles.menu}>
        {menu.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <ListRow
              title={item.label}
              showChevron
              leading={
                <Ionicons name={item.icon} size={20} color={colors.muted} />
              }
            />
          </View>
        ))}
      </View>
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
  section: { paddingHorizontal: screenPadding, paddingTop: spacing.lg },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1 },
  name: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
  signIn: { marginTop: spacing.md },
  menu: {
    marginTop: spacing['2xl'],
    paddingHorizontal: screenPadding,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
