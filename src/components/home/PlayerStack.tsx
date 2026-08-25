import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fontSize, fontWeight } from '../../theme/typography';

type Props = {
  joined: number;
  max?: number;
  size?: number;
};

export default function PlayerStack({ joined, max = 4, size = 28 }: Props) {
  const shown = Math.min(joined, max);
  const extra = joined - shown;
  const overlap = Math.round(size * 0.3);

  return (
    <View style={styles.row}>
      {Array.from({ length: shown }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: index > 0 ? -overlap : 0,
              backgroundColor: tints[index % tints.length],
            },
          ]}
        />
      ))}

      {extra > 0 ? (
        <View
          style={[
            styles.avatar,
            styles.more,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -overlap,
            },
          ]}
        >
          <Text style={[styles.moreText, { fontSize: size < 28 ? 11 : fontSize.caption }]}>
            +{extra}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const tints = [
  colors.avatarOne,
  colors.avatarTwo,
  colors.avatarThree,
  colors.avatarFour,
];

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  more: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontWeight: fontWeight.semibold,
    color: colors.muted,
  },
});
