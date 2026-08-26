import { useCallback, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { duration, easing } from '../../theme/motion';
import { radius } from '../../theme/radius';
import { screenPadding, spacing } from '../../theme/spacing';
import { fontSize, fontWeight, leading } from '../../theme/typography';

type BannerAction = 'matches' | 'arenas' | 'create';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: ImageSourcePropType;
  action: BannerAction;
};

const BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Need players?',
    subtitle: 'Join a match nearby',
    cta: 'Find matches',
    image: require('../../../assets/promo-banners/1.jpg'),
    action: 'matches',
  },
  {
    id: 'b2',
    title: 'Playing tonight?',
    subtitle: 'Book a ground fast',
    cta: 'Browse arenas',
    image: require('../../../assets/promo-banners/2.jpg'),
    action: 'arenas',
  },
  {
    id: 'b3',
    title: 'Got a team?',
    subtitle: 'Post your match',
    cta: 'Create match',
    image: require('../../../assets/promo-banners/3.jpg'),
    action: 'create',
  },
  {
    id: 'b4',
    title: 'Weekend fills up',
    subtitle: 'Lock your slot',
    cta: 'See slots',
    image: require('../../../assets/promo-banners/4.jpg'),
    action: 'arenas',
  },
];

const BANNER_WIDTH = Dimensions.get('window').width - screenPadding * 2;
const BANNER_HEIGHT = 124;
const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 32;
const fadeEasing = Easing.bezier(...easing.standard);

type Props = {
  onExploreMatches?: () => void;
  onBrowseArenas?: () => void;
  onCreateMatch?: () => void;
};

export default function HomeBannerCarousel({
  onExploreMatches,
  onBrowseArenas,
  onCreateMatch,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const opacity = useSharedValue(1);
  const slideX = useSharedValue(0);
  const dragX = useSharedValue(0);

  const banner = BANNERS[activeIndex];

  const handleAction = useCallback(
    (action: BannerAction) => {
      if (action === 'matches') onExploreMatches?.();
      else if (action === 'create') onCreateMatch?.();
      else onBrowseArenas?.();
    },
    [onBrowseArenas, onCreateMatch, onExploreMatches],
  );

  const setIndex = useCallback((next: number) => {
    indexRef.current = next;
    setActiveIndex(next);
  }, []);

  // runOnJS needs a stable reference — an inline arrow declared inside the
  // worklet is not callable, which would leave auto-advance paused forever.
  const resumeAuto = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const transitionTo = useCallback(
    (next: number, pauseAuto = false, direction = 0) => {
      if (next === indexRef.current) return;
      if (pauseAuto) pausedRef.current = true;

      const exitOffset = direction === 0 ? -8 : -direction * 12;

      opacity.value = withTiming(
        0,
        { duration: duration.fast, easing: fadeEasing },
        (done) => {
          if (!done) return;
          runOnJS(setIndex)(next);
          slideX.value = direction === 0 ? 8 : direction * 12;
          opacity.value = withTiming(1, {
            duration: duration.normal,
            easing: fadeEasing,
          });
          slideX.value = withTiming(0, {
            duration: duration.normal,
            easing: fadeEasing,
          });
          if (pauseAuto) runOnJS(resumeAuto)();
        },
      );
      slideX.value = withTiming(exitOffset, {
        duration: duration.fast,
        easing: fadeEasing,
      });
    },
    [opacity, resumeAuto, setIndex, slideX],
  );

  const goNext = useCallback(() => {
    transitionTo((indexRef.current + 1) % BANNERS.length, true, 1);
  }, [transitionTo]);

  const goPrev = useCallback(() => {
    transitionTo(
      (indexRef.current - 1 + BANNERS.length) % BANNERS.length,
      true,
      -1,
    );
  }, [transitionTo]);

  const advance = useCallback(() => {
    transitionTo((indexRef.current + 1) % BANNERS.length, false, 1);
  }, [transitionTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      advance();
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [advance]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: slideX.value + dragX.value }],
  }));

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-14, 14])
    .onUpdate((event) => {
      dragX.value = Math.max(-20, Math.min(20, event.translationX * 0.18));
    })
    .onEnd((event) => {
      dragX.value = withTiming(0, {
        duration: duration.fast,
        easing: fadeEasing,
      });
      if (event.translationX <= -SWIPE_THRESHOLD) runOnJS(goNext)();
      else if (event.translationX >= SWIPE_THRESHOLD) runOnJS(goPrev)();
    })
    .onFinalize(() => {
      dragX.value = withTiming(0, {
        duration: duration.fast,
        easing: fadeEasing,
      });
    });

  return (
    <View style={styles.wrap}>
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.card}>
          <Animated.View style={[StyleSheet.absoluteFill, contentStyle]}>
            <Image
              source={banner.image}
              style={styles.art}
              resizeMode="cover"
              accessible={false}
            />
          </Animated.View>

          <LinearGradient
            colors={[
              'rgba(4,42,27,0.92)',
              'rgba(6,61,39,0.70)',
              'rgba(10,82,53,0.18)',
              'transparent',
            ]}
            locations={[0, 0.2, 0.36, 0.5]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Photos vary in brightness — this keeps the dots readable over
              whatever sits at the bottom of the image. */}
          <LinearGradient
            colors={['transparent', 'rgba(4,21,14,0.30)']}
            locations={[0.72, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={styles.textPane}>
            <Animated.View style={contentStyle}>
              <Text numberOfLines={2} style={styles.title}>
                {banner.title}
              </Text>
              <Text numberOfLines={1} style={styles.subtitle}>
                {banner.subtitle}
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => handleAction(banner.action)}
                hitSlop={8}
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
              >
                <Text style={styles.ctaText}>{banner.cta}</Text>
                <Ionicons name="arrow-forward" size={12} color={colors.text} />
              </Pressable>
            </Animated.View>
          </View>

          <View style={styles.dots}>
            {BANNERS.map((item, index) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Show banner ${index + 1}`}
                accessibilityState={{ selected: index === activeIndex }}
                hitSlop={8}
                onPress={() => transitionTo(index, true)}
                style={[styles.dot, index === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg, paddingHorizontal: screenPadding },
  card: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
    ...elevation.card,
  },
  art: { width: '100%', height: '100%' },
  textPane: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    maxWidth: '46%',
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  subtitle: {
    maxWidth: '46%',
    marginTop: spacing.xs,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    fontWeight: fontWeight.regular,
    color: 'rgba(255,255,255,0.88)',
  },
  cta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    height: 28,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  ctaPressed: { opacity: 0.9 },
  ctaText: {
    fontSize: fontSize.caption,
    lineHeight: leading(fontSize.caption),
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlignVertical: 'center',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 18,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
});
