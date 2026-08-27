import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { ScreenHeader } from '../components/ui';
import type { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

type Props = StackScreenProps<ProfileStackParamList, 'Help'>;

// Old-architecture Android needs this opt-in for LayoutAnimation. It is a
// no-op on Fabric, where the animation works out of the box.
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SUPPORT_EMAIL = 'support@gameon.pk';
const SUPPORT_PHONE = '+923001234567';

type Faq = { id: string; question: string; answer: string };

const FAQS: Faq[] = [
  {
    id: 'book',
    question: 'How do I book a ground?',
    answer:
      'Open any arena from the home screen, pick a date and an available time slot, then confirm. You will see the full price breakdown, including the service fee, before you pay.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel a booking?',
    answer:
      'Yes. Go to Bookings, open the booking and tap Cancel. Cancellations made more than 12 hours before the slot are refunded in full. Later cancellations count towards your show-up rate.',
  },
  {
    id: 'match',
    question: 'What is an open match?',
    answer:
      'An open match is a game someone has booked but still needs players for. Join one to play with new people and split the ground cost between everyone attending.',
  },
  {
    id: 'rating',
    question: 'How is my show-up rate calculated?',
    answer:
      'It is the share of matches you joined and actually attended. Turning up keeps it high, which helps hosts accept your join requests.',
  },
  {
    id: 'payment',
    question: 'Which payment methods are supported?',
    answer:
      'Cash at the venue is supported today. JazzCash, Easypaisa and card payments are on the way.',
  },
];

export default function HelpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Help and support" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact — the fastest way out of a problem goes first. */}
        <View style={styles.contactRow}>
          <ContactCard
            icon="mail-outline"
            label="Email us"
            hint="Replies in ~4 hours"
            onPress={() =>
              void Linking.openURL(
                `mailto:${SUPPORT_EMAIL}?subject=GameOn%20support`,
              )
            }
          />
          <ContactCard
            icon="logo-whatsapp"
            label="WhatsApp"
            hint="9am – 11pm daily"
            onPress={() =>
              void Linking.openURL(
                `whatsapp://send?phone=${SUPPORT_PHONE.replace('+', '')}`,
              )
            }
          />
        </View>

        <Text style={styles.sectionLabel}>Frequently asked</Text>
        <View style={styles.group}>
          {FAQS.map((faq, index) => {
            const open = openId === faq.id;
            return (
              <View key={faq.id} style={index > 0 ? styles.divided : null}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  onPress={() => toggle(faq.id)}
                  style={({ pressed }) => [
                    styles.question,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Ionicons
                    name={open ? 'remove' : 'add'}
                    size={18}
                    color={open ? colors.primary : colors.muted}
                  />
                </Pressable>
                {open ? (
                  <Text style={styles.answer}>{faq.answer}</Text>
                ) : null}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Report a problem</Text>
        <View style={styles.group}>
          <ReportRow
            icon="alert-circle-outline"
            label="Report an issue with a ground"
          />
          <ReportRow
            icon="person-remove-outline"
            label="Report a player"
            divided
          />
          <ReportRow
            icon="card-outline"
            label="Payment or refund problem"
            divided
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ContactCard({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.contactCard, pressed && styles.pressed]}
    >
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={19} color={colors.primaryDark} />
      </View>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactHint} numberOfLines={1}>
        {hint}
      </Text>
    </Pressable>
  );
}

function ReportRow({
  icon,
  label,
  divided = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  divided?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        divided && styles.divided,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.muted} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={17} color={colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  flex: { flex: 1 },
  content: { paddingHorizontal: screenPadding },
  pressed: { opacity: 0.7 },

  contactRow: { flexDirection: 'row', gap: spacing.md },
  contactCard: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  contactIcon: {
    width: 36,
    height: 36,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  contactHint: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },

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
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  questionText: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  answer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption, 1.6),
    color: colors.muted,
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
});
