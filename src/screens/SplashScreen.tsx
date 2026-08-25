import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StadiumScene from '../components/art/StadiumScene';
import { AppLogo } from '../components/splash/AppLogo';
import { Button } from '../components/ui';
import { colors } from '../theme/colors';
import { screenPadding, spacing } from '../theme/spacing';
import { duration, easing, translate } from '../theme/motion';
import { fontFamily, fontSize, fontWeight } from '../theme/typography';

type Props = {
  /** Called when the user chooses to continue into the app. */
  onFinish: () => void;
};

const PAGE_COUNT = 3;

export default function SplashScreen({ onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const intro = useSharedValue(0);
  const actions = useSharedValue(0);

  useEffect(() => {
    intro.value = withTiming(1, {
      duration: duration.slow,
      easing: Easing.bezier(...easing.standard),
    });
    actions.value = withDelay(
      120,
      withTiming(1, {
        duration: duration.slow,
        easing: Easing.bezier(...easing.standard),
      }),
    );
  }, [intro, actions]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: translate.enter * (1 - intro.value) }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actions.value,
    transform: [{ translateY: translate.enter * (1 - actions.value) }],
  }));

  return (
    <View style={styles.screen}>
      <StadiumScene style={StyleSheet.absoluteFill} />

      <LinearGradient
        colors={[colors.scrimSoft, colors.scrimMid, colors.scrimStrong]}
        locations={[0, 0.45, 0.82]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + spacing['2xl'] }]}>
        <Animated.View style={introStyle}>
          <AppLogo />
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={introStyle}>
          <Text style={styles.headline}>
            Play more.{'\n'}Play together.{'\n'}
            <Text style={styles.headlineAccent}>Play everywhere.</Text>
          </Text>

          <Text style={styles.tagline}>
            Find a ground, invite your people, and make every game count.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.dots, actionsStyle]}>
          {Array.from({ length: PAGE_COUNT }).map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === 0 ? styles.dotActive : null]}
            />
          ))}
        </Animated.View>

        <Animated.View
          style={[
            styles.actions,
            actionsStyle,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          <Button label="Get started" onPress={onFinish} />
          <Button
            label="Log in"
            variant="outlineOnDark"
            onPress={onFinish}
            style={styles.secondaryAction}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.splashBackground },
  content: { flex: 1, paddingHorizontal: screenPadding },
  spacer: { flex: 1 },
  headline: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.display,
    lineHeight: fontSize.display * 1.2,
    color: colors.white,
  },
  headlineAccent: { color: colors.primary },
  tagline: {
    marginTop: spacing.lg,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.bodyLarge * 1.5,
    color: colors.onDarkMuted,
  },
  dots: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 3,
    backgroundColor: colors.onDarkMuted,
    opacity: 0.5,
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: colors.primary,
    opacity: 1,
  },
  actions: { marginTop: spacing['2xl'], gap: spacing.md },
  secondaryAction: {},
});
