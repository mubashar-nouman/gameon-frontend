import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

import ArenaSortPanel, { type SortOption } from './ArenaSortPanel';
import Button from '../ui/Button';
import { colors } from '../../theme/colors';
import { duration, easing } from '../../theme/motion';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export type { SortOption };

type Props = {
  visible: boolean;
  value: SortOption;
  resultCount: number;
  onClose: () => void;
  onApply: (value: SortOption) => void;
};

/** Drag distance that commits to closing. */
const DISMISS_THRESHOLD = 110;
/** How far the sheet slides out when dismissed. */
const DISMISS_TRAVEL = 600;

export default function ArenaFilterSheet({
  visible,
  value,
  resultCount,
  onClose,
  onApply,
}: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);
  const dragY = useSharedValue(0);

  // Reset the drag offset whenever the sheet reopens, or it would appear
  // already pushed down from the previous dismissal.
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
      // Downward only — dragging up should not lift the sheet off its anchor.
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > DISMISS_THRESHOLD || event.velocityY > 800;

      if (shouldClose) {
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

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => setDraft('nearest');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.gestureRoot}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          style={styles.backdrop}
          onPress={onClose}
        />

        <GestureDetector gesture={dragGesture}>
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) },
            sheetStyle,
          ]}
        >
          <View style={styles.dragArea}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <ArenaSortPanel value={draft} onChange={setDraft} />

          <View style={styles.footer}>
            <Button
              label="Reset"
              variant="secondary"
              onPress={handleReset}
              style={styles.resetBtn}
            />
            <Button
              label={`Show ${resultCount} ${resultCount === 1 ? 'arena' : 'arenas'}`}
              onPress={handleApply}
              style={styles.applyBtn}
            />
          </View>
        </Animated.View>
        </GestureDetector>
      </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Modal mounts a separate native view tree, so gestures inside it need
  // their own root — the one in App.tsx does not reach here.
  gestureRoot: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17,24,39,0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
  },
  dragArea: { paddingTop: spacing.xs },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSubtle,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  pressed: { opacity: 0.65 },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
  resetBtn: {
    flex: 1,
    height: 48,
  },
  applyBtn: {
    flex: 2,
    height: 48,
  },
});
