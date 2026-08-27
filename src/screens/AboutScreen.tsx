import { Ionicons } from '@expo/vector-icons';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { AppLogo } from '../components/splash/AppLogo';
import { ScreenHeader } from '../components/ui';
import type { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = StackScreenProps<ProfileStackParamList, 'About'>;

const APP_VERSION = '1.0.0';

type LinkItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  url?: string;
};

const LEGAL: LinkItem[] = [
  { id: 'terms', label: 'Terms of service', icon: 'document-text-outline' },
  { id: 'privacy', label: 'Privacy policy', icon: 'shield-checkmark-outline' },
  { id: 'licences', label: 'Open source licences', icon: 'code-slash-outline' },
];

const SOCIAL: LinkItem[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'logo-instagram',
    url: 'https://instagram.com/gameon.pk',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'logo-facebook',
    url: 'https://facebook.com/gameon.pk',
  },
  {
    id: 'website',
    label: 'gameon.pk',
    icon: 'globe-outline',
    url: 'https://gameon.pk',
  },
];

export default function AboutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="About GameOn" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <AppLogo />
          <Text style={styles.version}>Version {APP_VERSION}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.mission}>
            GameOn makes it simple to find a ground, fill it with players and
            get on with the game. We started in Lahore because booking a pitch
            here still means a dozen phone calls — and it should not.
          </Text>
        </View>

        <View style={styles.statRow}>
          <Stat value="58" label="Grounds" />
          <View style={styles.statDivider} />
          <Stat value="6" label="Sports" />
          <View style={styles.statDivider} />
          <Stat value="Lahore" label="City" />
        </View>

        <Text style={styles.sectionLabel}>Follow us</Text>
        <View style={styles.group}>
          {SOCIAL.map((item, index) => (
            <LinkRow key={item.id} item={item} divided={index > 0} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Legal</Text>
        <View style={styles.group}>
          {LEGAL.map((item, index) => (
            <LinkRow key={item.id} item={item} divided={index > 0} />
          ))}
        </View>

        <Text style={styles.copyright}>
          Made in Lahore · © {new Date().getFullYear()} GameOn
        </Text>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LinkRow({ item, divided }: { item: LinkItem; divided: boolean }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={item.url ? () => void Linking.openURL(item.url!) : undefined}
      style={({ pressed }) => [
        styles.row,
        divided && styles.divided,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={item.icon} size={18} color={colors.muted} />
      </View>
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Ionicons
        name={item.url ? 'open-outline' : 'chevron-forward'}
        size={17}
        color={colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  flex: { flex: 1 },
  content: { paddingHorizontal: screenPadding },
  pressed: { opacity: 0.7 },

  brand: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  version: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

  card: {
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  mission: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote, 1.6),
    color: colors.text,
  },

  statRow: {
    marginTop: spacing.md,
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
    fontSize: fontSize.callout,
    lineHeight: leading(fontSize.callout, 1.3),
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
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.bold,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  group: {
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  divided: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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

  copyright: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
});
