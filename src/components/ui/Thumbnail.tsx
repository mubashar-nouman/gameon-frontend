import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

type Props = {
  /** Ionicons glyph shown while no real photo exists. */
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Neutral placeholder standing in for arena photography. Swap the inner view
 * for an <Image> once real assets land — callers keep the same box.
 */
export default function Thumbnail({
  icon = 'image-outline',
  size = 72,
  style,
}: Props) {
  return (
    <View style={[styles.box, { width: size, height: size }, style]}>
      <Ionicons name={icon} size={size / 3} color={colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
