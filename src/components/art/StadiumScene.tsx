import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = { style?: StyleProp<ViewStyle> };

/**
 * Night-match stadium illustration for the splash/onboarding hero.
 * DESIGN.md §11 allows brand treatment here that in-app screens forbid.
 * Replace with real photography when it exists.
 */
export default function StadiumScene({ style }: Props) {
  return (
    <View style={[styles.box, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 620" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#04150E" />
            <Stop offset="0.55" stopColor="#07301F" />
            <Stop offset="1" stopColor="#0A4A2E" />
          </LinearGradient>
          <LinearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.20" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="390" height="620" fill="url(#sky)" />

        {/* Floodlight beams */}
        <Path d="M52 96 L150 340 L-30 340 Z" fill="url(#beam)" />
        <Path d="M338 96 L420 340 L240 340 Z" fill="url(#beam)" />

        {/* Floodlight masts */}
        <G opacity={0.95}>
          <Rect x="48" y="96" width="6" height="120" fill="#0B3A26" />
          <Rect x="26" y="72" width="50" height="30" rx="4" fill="#10583A" />
          {[34, 48, 62].map((x) => (
            <Circle key={x} cx={x} cy="80" r="5" fill="#EAFBF2" opacity={0.9} />
          ))}
          {[34, 48, 62].map((x) => (
            <Circle key={`b${x}`} cx={x} cy="94" r="5" fill="#EAFBF2" opacity={0.75} />
          ))}
        </G>
        <G opacity={0.95}>
          <Rect x="336" y="96" width="6" height="120" fill="#0B3A26" />
          <Rect x="314" y="72" width="50" height="30" rx="4" fill="#10583A" />
          {[322, 336, 350].map((x) => (
            <Circle key={x} cx={x} cy="80" r="5" fill="#EAFBF2" opacity={0.9} />
          ))}
          {[322, 336, 350].map((x) => (
            <Circle key={`b${x}`} cx={x} cy="94" r="5" fill="#EAFBF2" opacity={0.75} />
          ))}
        </G>

        {/* Stand silhouette */}
        <Path d="M0 214 L390 214 L390 268 L0 268 Z" fill="#062A1B" />
        {Array.from({ length: 26 }).map((_, i) => (
          <Rect key={i} x={i * 15 + 2} y="222" width="9" height="38" fill="#0A3D28" opacity={0.8} />
        ))}

        {/* Pitch */}
        <Path d="M0 268 L390 268 L390 620 L0 620 Z" fill="#0C6139" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Path
            key={i}
            d={`M${i * 56 - 40} 268 L${i * 56 + 8} 268 L${i * 56 + 40} 620 L${i * 56 - 30} 620 Z`}
            fill="#0F7344"
            opacity={i % 2 === 0 ? 0.55 : 0}
          />
        ))}

        {/* Pitch markings */}
        <Ellipse cx="195" cy="300" rx="120" ry="26" stroke="#DFF6EA" strokeWidth="2" fill="none" opacity={0.28} />
        <Line x1="0" y1="300" x2="390" y2="300" stroke="#DFF6EA" strokeWidth="2" opacity={0.22} />
        <Ellipse cx="195" cy="486" rx="190" ry="60" stroke="#DFF6EA" strokeWidth="2" fill="none" opacity={0.18} />

        {/* A single player gives the welcome screen the energy of match night
            without carrying the campaign treatment into functional screens. */}
        <G transform="translate(247 300)">
          <Ellipse cx="41" cy="255" rx="48" ry="9" fill="#03180F" opacity={0.42} />
          <Circle cx="40" cy="25" r="18" fill="#10251D" />
          <Path d="M29 45 C8 73 13 137 28 164 L54 159 C69 119 72 74 52 45 Z" fill="#111D19" />
          <Path d="M28 158 12 235 32 239 50 170 Z" fill="#0B1712" />
          <Path d="m49 158 30 71 19-8-29-76Z" fill="#0B1712" />
          <Path d="m13 231-18 19 39 1-2-13Z" fill="#DCE7E0" />
          <Path d="m77 225 24 8 3-11-22-10Z" fill="#DCE7E0" />
          <Path d="m22 60-27 39 11 8 31-35Z" fill="#111D19" />
          <Path d="m56 62 37 39 10-10-34-42Z" fill="#111D19" />
        </G>
        <Circle cx="237" cy="553" r="13" fill="#F5F5F2" />
        <Path d="M226 553h22M237 542v22M229 545l16 16M245 545l-16 16" stroke="#222B25" strokeWidth="2" opacity={0.72} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: '#04150E' },
});
