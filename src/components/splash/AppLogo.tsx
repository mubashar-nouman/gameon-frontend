import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/colors';

const LOGO_SIZE = 56;

export function AppLogo() {
  return (
    <View style={styles.mark} accessibilityLabel="GameOn">
      <Svg width={LOGO_SIZE} height={LOGO_SIZE} viewBox="0 0 56 56">
        <Path
          d="M6 42.5 22.7 10.8c1.1-2.1 4.2-2.1 5.3 0l8.3 15.7-7.1 2.6-3.9-7.6-11.5 21H6Z"
          fill={colors.primary}
        />
        <Path
          d="m27.2 33 8.5-3.2 8 12.7H35l-4.2-6.7L27.2 33Z"
          fill={colors.primary}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
