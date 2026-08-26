import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
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
  useAnimatedScrollHandler,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cities, getCity, type Area, type City } from '../../data';
import { colors } from '../../theme/colors';
import { duration, easing } from '../../theme/motion';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type Props = {
  visible: boolean;
  cityId: string;
  areaId: string;
  /** Arena count per "cityId:areaId". */
  counts: Record<string, number>;
  onClose: () => void;
  onSelect: (cityId: string, areaId: string) => void;
  onUseCurrentLocation: () => void;
  locating: boolean;
  locateError?: string;
};

/** Drag distance that commits to closing. */
const DISMISS_THRESHOLD = 110;
/** How far the sheet slides out when dismissed. */
const DISMISS_TRAVEL = 600;

export default function LocationSheet({
  visible,
  cityId,
  areaId,
  counts,
  onClose,
  onSelect,
  onUseCurrentLocation,
  locating,
  locateError,
}: Props) {
  const insets = useSafeAreaInsets();
  // Which city's areas are on screen — not necessarily the applied one, since
  // the user can browse another city before committing to an area.
  const [browsingCityId, setBrowsingCityId] = useState(cityId);

  useEffect(() => {
    if (visible) setBrowsingCityId(cityId);
  }, [visible, cityId]);

  const dragY = useSharedValue(0);
  // The area list must be scrolled to the top before a downward drag is
  // treated as a dismiss, otherwise the two gestures fight.
  const listAtTop = useSharedValue(true);
  const listRef = useRef<Animated.ScrollView>(null);

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
    // Vertical only; horizontal drags belong to the city scroller.
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

  const onListScroll = useAnimatedScrollHandler((event) => {
    listAtTop.value = event.contentOffset.y <= 0;
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  const browsingCity = getCity(browsingCityId);
  const wholeCityArea = browsingCity?.areas.find(
    (area) => area.matches.length === 0,
  );
  const namedAreas =
    browsingCity?.areas.filter((area) => area.matches.length > 0) ?? [];
  const isApplied = (id: string) => browsingCityId === cityId && id === areaId;

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

        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + spacing.lg },
            sheetStyle,
          ]}
        >
          {/* Everything above the area list is draggable. The list keeps its
              own scrolling, so the two gestures never overlap. */}
          <GestureDetector gesture={dragGesture}>
          <View style={styles.dragArea}>
            <View style={styles.grabber} />

            <View style={styles.header}>
              <Text style={styles.title}>Choose location</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                onPress={onClose}
              >
                <Ionicons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: locating }}
            disabled={locating}
            onPress={onUseCurrentLocation}
            style={({ pressed }) => [styles.gpsRow, pressed && styles.pressed]}
          >
            <View style={styles.gpsIcon}>
              {locating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={locateError ? 'warning-outline' : 'locate'}
                  size={18}
                  color={locateError ? colors.accentDark : colors.primary}
                />
              )}
            </View>

            <View style={styles.rowText}>
              <Text style={styles.gpsTitle}>
                {locating ? 'Finding you…' : 'Use my current location'}
              </Text>
              <Text
                style={[styles.rowMeta, locateError ? styles.gpsError : null]}
                numberOfLines={2}
              >
                {locateError ?? 'Detect your city and area automatically'}
              </Text>
            </View>

            {!locating ? (
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            ) : null}
          </Pressable>

          <Text style={styles.groupLabel}>City</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cityScroller}
            contentContainerStyle={styles.cityRow}
          >
            {cities.map((city: City) => {
              const active = city.id === browsingCityId;
              const disabled = !city.enabled;

              return (
                <Pressable
                  key={city.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active, disabled }}
                  accessibilityLabel={
                    disabled ? `${city.name}, coming soon` : city.name
                  }
                  disabled={disabled}
                  onPress={() => setBrowsingCityId(city.id)}
                  style={({ pressed }) => [
                    styles.cityPill,
                    active && styles.cityPillActive,
                    disabled && styles.cityPillDisabled,
                    pressed && !disabled && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.cityText,
                      active && styles.cityTextActive,
                      disabled && styles.cityTextDisabled,
                    ]}
                  >
                    {city.name}
                  </Text>
                  {disabled ? (
                    <Text style={styles.soonTag}>(Soon)</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={[styles.groupLabel, styles.groupLabelTight]}>
            {browsingCityId === cityId
              ? 'Area'
              : `Areas in ${browsingCity?.name}`}
          </Text>
          </View>
          </GestureDetector>

          <Animated.ScrollView
            ref={listRef}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={onListScroll}
          >
            {wholeCityArea ? (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isApplied(wholeCityArea.id) }}
                onPress={() => onSelect(browsingCityId, wholeCityArea.id)}
                style={({ pressed }) => [
                  styles.wholeRow,
                  isApplied(wholeCityArea.id) && styles.wholeRowActive,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="globe-outline"
                  size={18}
                  color={colors.primaryDark}
                />
                <View style={styles.rowText}>
                  <Text style={styles.wholeTitle}>
                    All of {browsingCity?.name}
                  </Text>
                  <Text style={styles.wholeMeta}>
                    {counts[`${browsingCityId}:${wholeCityArea.id}`] ?? 0} arenas
                    across every area
                  </Text>
                </View>
                {isApplied(wholeCityArea.id) ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                  />
                ) : null}
              </Pressable>
            ) : null}

            <View style={styles.listInner}>
              {namedAreas.map((area: Area, index: number) => {
                const active = isApplied(area.id);
                const count = counts[`${browsingCityId}:${area.id}`] ?? 0;

                return (
                  <Pressable
                    key={area.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => onSelect(browsingCityId, area.id)}
                    style={({ pressed }) => [
                      styles.row,
                      index > 0 && styles.rowDivided,
                      active && styles.rowActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[styles.areaIcon, active && styles.areaIconActive]}
                    >
                      <Ionicons
                        name={active ? 'checkmark' : 'location-sharp'}
                        size={14}
                        color={active ? colors.white : colors.muted}
                      />
                    </View>

                    <Text
                      style={[styles.rowTitle, active && styles.rowTitleActive]}
                      numberOfLines={1}
                    >
                      {area.name}
                    </Text>

                    <Text
                      style={[
                        styles.countBadge,
                        active && styles.countBadgeActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Modal mounts a separate native view tree, so gestures inside it need
  // their own root — the one in App.tsx does not reach here.
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
    maxHeight: '84%',
  },
  dragArea: { paddingTop: spacing.xs },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.sectionTitle,
    lineHeight: leading(fontSize.sectionTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  pressed: { opacity: 0.65 },

  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: screenPadding,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  gpsIcon: {
    width: 36,
    height: 36,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTitle: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  gpsError: { color: colors.accentDark },

  groupLabel: {
    marginTop: spacing.xl,
    // NOTE: groupLabelTight drops this where the previous block already
    // supplies its own bottom margin.
    marginBottom: spacing.sm,
    paddingHorizontal: screenPadding,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  cityScroller: {
    // Let the row size to its content. flexGrow:0 stops it stretching, and the
    // content padding below supplies the clearance the pill borders need.
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: spacing.md,
  },
  groupLabelTight: { marginTop: 0 },
  cityRow: {
    gap: spacing.sm,
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  cityPill: {
    minHeight: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cityPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityText: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlignVertical: 'center',
  },
  cityTextActive: { color: colors.white },
  cityPillDisabled: {
    backgroundColor: colors.pageBackground,
    borderColor: colors.borderSubtle,
  },
  cityTextDisabled: { color: colors.muted },
  soonTag: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.accentDark,
    textTransform: 'uppercase',
  },

  list: { flexShrink: 1, marginHorizontal: screenPadding },
  wholeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  wholeRowActive: { borderColor: colors.primary },
  wholeTitle: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
  },
  wholeMeta: {
    marginTop: spacing.xs,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.primaryDark,
  },

  listInner: {
    borderRadius: radius.card,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
  rowActive: { backgroundColor: colors.primarySoft },
  rowText: { flex: 1 },
  rowTitle: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  rowTitleActive: { color: colors.primaryDark, fontWeight: fontWeight.semibold },
  rowMeta: {
    marginTop: spacing.xs,
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    color: colors.muted,
  },
  areaIcon: {
    width: 30,
    height: 30,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 15,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaIconActive: { backgroundColor: colors.primary },
  countBadge: {
    minWidth: 20,
    textAlign: 'right',
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.muted,
  },
  countBadgeActive: { color: colors.primaryDark },
});
