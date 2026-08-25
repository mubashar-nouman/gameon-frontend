import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OpenMatchCard from '../components/home/OpenMatchCard';
import { openMatches } from '../data';
import { colors } from '../theme/colors';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: TAB_BAR_CLEARANCE + insets.bottom,
        },
      ]}
      data={openMatches}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Open matches</Text>
          <Text style={styles.subtitle}>Matches near you needing players</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <OpenMatchCard match={item} layout="wide" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: {},
  header: { paddingHorizontal: screenPadding, marginBottom: spacing.lg },
  title: {
    fontSize: fontSize.screenTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.footnote,
    color: colors.muted,
  },
  item: { paddingHorizontal: screenPadding, paddingBottom: spacing.md },
});
