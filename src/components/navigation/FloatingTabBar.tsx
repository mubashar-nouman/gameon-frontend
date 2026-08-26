import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { colors } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';
import { duration, easing } from '../../theme/motion';

type IconPair = {
  outline: keyof typeof Ionicons.glyphMap;
  filled: keyof typeof Ionicons.glyphMap;
};

type Props = BottomTabBarProps & {
  icons: Record<string, IconPair>;
  labels: Record<string, string>;
  /** Center action — creating an open match. */
  onCreatePress?: () => void;
};

/**
 * Floating pill tab bar. DESIGN.md §7 forbids custom tab bars "unless
 * specified" — this is the specified exception, so motion still follows §8:
 * timing curves only, no springs, inside the 200–350ms budget.
 */
export default function FloatingTabBar({
  state,
  navigation,
  descriptors,
  icons,
  labels,
  onCreatePress,
}: Props) {
  const insets = useSafeAreaInsets();

  // A nested screen can opt the bar out via tabBarStyle: { display: 'none' }.
  // This bar is custom, so React Navigation cannot apply that for us.
  const focusedRoute = state.routes[state.index];
  const focusedStyle = descriptors[focusedRoute.key]?.options.tabBarStyle as
    | { display?: 'none' | 'flex' }
    | undefined;

  if (focusedStyle?.display === 'none') return null;

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const item = (
            <TabItem
              key={route.key}
              focused={state.index === index}
              icon={icons[route.name]}
              label={labels[route.name] ?? route.name}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (state.index !== index && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );

          // The create action sits in the middle of the bar, between the
          // second and third tabs.
          if (index === 2) {
            return [
              <CreateButton key="create" onPress={onCreatePress} />,
              item,
            ];
          }

          return item;
        })}
      </View>
    </View>
  );
}

function CreateButton({ onPress }: { onPress?: () => void }) {
  const press = useSharedValue(0);

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.08 }],
  }));

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${press.value * 90}deg` }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Create open match"
      onPress={onPress}
      onPressIn={() => {
        press.value = withTiming(1, { duration: duration.fast });
      }}
      onPressOut={() => {
        press.value = withTiming(0, { duration: duration.fast });
      }}
    >
      <Animated.View style={[styles.fabWrap, fabStyle]}>
        <View style={styles.fabHalo} />
        <View style={styles.fab}>
          <Animated.View style={plusStyle}>
            <Ionicons name="add" size={28} color={colors.white} />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

type TabItemProps = {
  focused: boolean;
  icon: IconPair;
  label: string;
  onPress: () => void;
};

function TabItem({ focused, icon, label, onPress }: TabItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);
  const press = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: duration.normal,
      easing: Easing.bezier(...easing.standard),
    });
  }, [focused, progress]);

  // Soft pill grows behind the active tab.
  // Underline grows out from the centre as the tab becomes active.
  const underlineStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: 0.3 + progress.value * 0.7 }],
  }));

  // Icon lifts and grows slightly on select, and dips while pressed.
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -3 * progress.value + press.value * 2 },
      { scale: 1 + progress.value * 0.12 - press.value * 0.06 },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 0.7 + progress.value * 0.3,
    transform: [{ translateY: -1 * progress.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => {
        press.value = withTiming(1, { duration: duration.fast });
      }}
      onPressOut={() => {
        press.value = withTiming(0, { duration: duration.fast });
      }}
      style={styles.item}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? icon.filled : icon.outline}
          size={20}
          color={focused ? colors.primary : colors.muted}
        />
      </Animated.View>

      <Animated.Text
        style={[styles.label, focused ? styles.labelActive : null, labelStyle]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>

      <Animated.View style={[styles.underline, underlineStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...elevation.raised,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  underline: {
    // Absolute so the indicator never adds height to the bar.
    position: 'absolute',
    bottom: 0,
    width: 18,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: fontSize.caption,
    lineHeight: 15,
    fontWeight: fontWeight.medium,
    color: colors.muted,
    marginTop: 0,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  fabWrap: {
    width: 56,
    height: 56,
    marginHorizontal: spacing.sm,
    marginTop: -spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabHalo: {
    position: 'absolute',
    width: 68,
    height: 68,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 34,
    backgroundColor: colors.white,
  },
  fab: {
    width: 56,
    height: 56,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.raised,
  },
});
