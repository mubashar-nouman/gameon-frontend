import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';


type Props = {
  sportId: string;
  style?: StyleProp<ViewStyle>;
  /** Corner radius — all corners when `square`, top only otherwise. */
  radius?: number;
  /** When true, applies radius to all four corners (compact thumbnails). */
  square?: boolean;
};

const turf = { dark: '#0F5132', mid: '#137547', light: '#1B8A55' };
const clay = { dark: '#8A4B2A', mid: '#A65C34', light: '#C0713F' };
const court = { dark: '#1F4E79', mid: '#2A6394', light: '#3B79AE' };

/**
 * Illustrated stand-in for arena photography. Deliberately flat and low-detail
 * so it reads as artwork, not a failed image load. Swap for <Image> when real
 * venue photos exist — callers keep the same box.
 */
export default function SportArt({ sportId, style, radius = 0, square = false }: Props) {
  const cornerStyle = square
    ? { borderRadius: radius }
    : { borderTopLeftRadius: radius, borderTopRightRadius: radius };

  return (
    <View style={[styles.box, cornerStyle, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        {sportId === 'cricket' ? <CricketArt /> : null}
        {sportId === 'badminton' ? <BadmintonArt /> : null}
        {sportId === 'basketball' ? <BasketballArt /> : null}
        {sportId === 'padel' ? <TennisArt /> : null}
        {sportId === 'football' ? <FootballArt /> : null}
      </Svg>
    </View>
  );
}

function FootballArt() {
  return (
    <G>
      <Defs>
        <LinearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={turf.light} />
          <Stop offset="1" stopColor={turf.dark} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="180" fill="url(#pitch)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Rect
          key={i}
          x={i * 54}
          y="0"
          width="27"
          height="180"
          fill={turf.mid}
          opacity={0.35}
        />
      ))}
      <Line x1="160" y1="0" x2="160" y2="180" stroke="#FFFFFF" strokeWidth="2" opacity={0.5} />
      <Circle cx="160" cy="90" r="34" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.5} />
      <Circle cx="160" cy="90" r="4" fill="#FFFFFF" opacity={0.5} />
      <Rect x="0" y="52" width="42" height="76" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.45} />
      <Rect x="278" y="52" width="42" height="76" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.45} />
    </G>
  );
}

function CricketArt() {
  return (
    <G>
      <Defs>
        <LinearGradient id="oval" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={turf.light} />
          <Stop offset="1" stopColor={turf.dark} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="180" fill="url(#oval)" />
      <Circle cx="160" cy="90" r="86" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.35} />
      <Rect x="140" y="34" width="40" height="112" fill={clay.mid} opacity={0.9} rx="2" />
      <Rect x="140" y="34" width="40" height="112" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity={0.5} />
      <Line x1="146" y1="48" x2="174" y2="48" stroke="#FFFFFF" strokeWidth="2" opacity={0.7} />
      <Line x1="146" y1="132" x2="174" y2="132" stroke="#FFFFFF" strokeWidth="2" opacity={0.7} />
      {[152, 160, 168].map((x) => (
        <Line key={x} x1={x} y1="40" x2={x} y2="50" stroke="#FFFFFF" strokeWidth="2" opacity={0.85} />
      ))}
    </G>
  );
}

function BadmintonArt() {
  return (
    <G>
      <Defs>
        <LinearGradient id="hall" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={court.light} />
          <Stop offset="1" stopColor={court.dark} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="180" fill="url(#hall)" />
      <Path d="M60 20 L260 20 L300 160 L20 160 Z" fill={court.mid} opacity={0.7} />
      <Path d="M60 20 L260 20 L300 160 L20 160 Z" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.55} />
      <Line x1="40" y1="90" x2="280" y2="90" stroke="#FFFFFF" strokeWidth="2" opacity={0.65} />
      <Line x1="160" y1="20" x2="160" y2="160" stroke="#FFFFFF" strokeWidth="1.5" opacity={0.4} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Line key={i} x1={40 + i * 34} y1="86" x2={40 + i * 34} y2="94" stroke="#FFFFFF" strokeWidth="1" opacity={0.5} />
      ))}
    </G>
  );
}

function BasketballArt() {
  return (
    <G>
      <Defs>
        <LinearGradient id="hardwood" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={clay.light} />
          <Stop offset="1" stopColor={clay.dark} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="180" fill="url(#hardwood)" />
      {Array.from({ length: 10 }).map((_, i) => (
        <Line
          key={i}
          x1={i * 32}
          y1="0"
          x2={i * 32}
          y2="180"
          stroke={clay.dark}
          strokeWidth="1"
          opacity={0.3}
        />
      ))}
      <Line x1="160" y1="0" x2="160" y2="180" stroke="#FFFFFF" strokeWidth="2" opacity={0.55} />
      <Circle cx="160" cy="90" r="30" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.55} />
      <Path d="M0 40 A56 50 0 0 1 0 140" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.5} />
      <Path d="M320 40 A56 50 0 0 0 320 140" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.5} />
    </G>
  );
}

function TennisArt() {
  return (
    <G>
      <Defs>
        <LinearGradient id="tennis" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={court.light} />
          <Stop offset="1" stopColor={court.dark} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="180" fill="url(#tennis)" />
      <Rect x="40" y="26" width="240" height="128" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity={0.55} />
      <Line x1="160" y1="26" x2="160" y2="154" stroke="#FFFFFF" strokeWidth="2" opacity={0.7} />
      <Line x1="40" y1="90" x2="280" y2="90" stroke="#FFFFFF" strokeWidth="1.5" opacity={0.4} />
      <Rect x="88" y="52" width="144" height="76" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity={0.4} />
      {Array.from({ length: 16 }).map((_, i) => (
        <Line
          key={i}
          x1={160}
          y1={26 + i * 8}
          x2={160}
          y2={30 + i * 8}
          stroke="#FFFFFF"
          strokeWidth="3"
          opacity={0.5}
        />
      ))}
    </G>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: turf.dark },
});
