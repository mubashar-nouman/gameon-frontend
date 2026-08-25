import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { elevation } from '../../theme/elevation';
import { radius } from '../../theme/radius';

type Variant = 'elevated' | 'outline';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** `elevated` — hairline border + soft shadow. `outline` — border only. */
  variant?: Variant;
  /** @deprecated Use variant="outline" instead. */
  flat?: boolean;
};

/**
 * Shadow lives on the outer shell; content clips on the inner shell.
 * A hairline border on the shell keeps edges crisp on light page backgrounds.
 */
export default function Card({
  children,
  style,
  variant,
  flat = false,
}: Props) {
  const resolved = flat ? 'outline' : (variant ?? 'elevated');

  return (
    <View
      style={[
        styles.shell,
        resolved === 'elevated' ? elevation.card : null,
        style,
      ]}
    >
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
  },
  inner: {
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
});
