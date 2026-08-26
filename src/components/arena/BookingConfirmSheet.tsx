import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';

import Button from '../ui/Button';
import { formatPkr, type Arena, type Slot } from '../../data';
import { colors } from '../../theme/colors';
import { duration, easing } from '../../theme/motion';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

/** Drag distance that commits to closing. */
const DISMISS_THRESHOLD = 110;
/** How far the sheet slides out when dismissed. */
const DISMISS_TRAVEL = 600;
/** Platform fee applied per booking, as a share of the slot price. */
const SERVICE_FEE_RATE = 0.05;

type Props = {
  visible: boolean;
  arena: Arena;
  slot: Slot | null;
  dateLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function BookingConfirmSheet({
  visible,
  arena,
  slot,
  dateLabel,
  onClose,
  onConfirm,
}: Props) {
  const insets = useSafeAreaInsets();
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (visible) dragY.value = 0;
  }, [visible, dragY]);

  const dismiss = () => {
    dragY.value = withTiming(
      DISMISS_TRAVEL,
      { duration: duration.fast, easing: Easing.bezier(...easing.standard) },
      (done) => {
        if (done) runOnJS(onClose)();
      },
    );
  };

  const dragGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-16, 16])
    .onUpdate((event) => {
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > 800) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withTiming(0, {
          duration: duration.fast,
          easing: Easing.bezier(...easing.standard),
        });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  const slotPrice = slot?.price ?? 0;
  const fee = Math.round(slotPrice * SERVICE_FEE_RATE);
  const total = slotPrice + fee;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.gestureRoot}>
        <View style={styles.overlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={styles.backdrop}
            onPress={onClose}
          />

          <GestureDetector gesture={dragGesture}>
            <Animated.View
              style={[
                styles.sheet,
                { paddingBottom: insets.bottom + spacing.lg },
                sheetStyle,
              ]}
            >
              <View style={styles.grabber} />

              <Text style={styles.title}>Confirm booking</Text>

              <View style={styles.card}>
                <Row label="Ground" value={arena.name} />
                <Row label="Location" value={arena.area} />
                <Row label="Date" value={dateLabel} />
                <Row label="Time" value={slot ? `${slot.time} · 60 min` : '—'} />
              </View>

              <View style={styles.card}>
                <Row label="Slot price" value={formatPkr(slotPrice)} />
                <Row label="Service fee" value={formatPkr(fee)} />
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPkr(total)}</Text>
                </View>
              </View>

              <View style={styles.note}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.muted}
                />
                <Text style={styles.noteText}>
                  The owner confirms within 15 minutes. You pay at the venue.
                </Text>
              </View>

              <Button
                label="Confirm booking"
                onPress={onConfirm}
                style={styles.confirm}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17,24,39,0.45)',
  },
  sheet: {
    backgroundColor: colors.pageBackground,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: screenPadding,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowLabel: {
    flex: 1,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },
  rowValue: {
    flexShrink: 1,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  divider: { height: 1, backgroundColor: colors.borderSubtle },
  totalRow: { flexDirection: 'row', alignItems: 'center' },
  totalLabel: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  noteText: {
    flex: 1,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  confirm: {},
});
