import { Easing } from 'react-native';
import type { StackCardInterpolationProps } from '@react-navigation/stack';

import { duration } from '../theme/motion';

const timing = {
  animation: 'timing' as const,
  config: {
    duration: duration.slow,
    // Matches theme easing.standard — expressive ease-out, no overshoot.
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  },
};

export const transitionSpec = { open: timing, close: timing } as const;

/**
 * Incoming screen rises and scales up from slightly small while the outgoing
 * one recedes and dims — reads as depth rather than a flat horizontal slide.
 */
export function depthInterpolator({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) {
  const progress = current.progress;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.height * 0.12, 0],
    extrapolate: 'clamp',
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
    extrapolate: 'clamp',
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.85, 1],
    extrapolate: 'clamp',
  });

  // When another screen pushes on top of this one, it settles back.
  const settleScale = next
    ? next.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.96],
        extrapolate: 'clamp',
      })
    : 1;

  const settleOpacity = next
    ? next.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
        extrapolate: 'clamp',
      })
    : 1;

  return {
    cardStyle: {
      opacity: next ? settleOpacity : opacity,
      transform: [{ translateY }, { scale: next ? settleScale : scale }],
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.25],
        extrapolate: 'clamp',
      }),
    },
  };
}
