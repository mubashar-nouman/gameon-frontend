import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';

import { duration, easing, translate } from '../../theme/motion';

type Props = {
  children: React.ReactNode;
  /** Stagger offset in ms. Keep small — §8 forbids staggered list animations. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/** Fade + short upward translate, within the §8 motion budget. */
export default function FadeInView({ children, delay = 0, style }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: duration.normal,
        easing: Easing.bezier(...easing.standard),
      }),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: translate.enter * (1 - progress.value) }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
