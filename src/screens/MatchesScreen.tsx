import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OpenMatchCard from '../components/home/OpenMatchCard';
import SegmentedTabs, {
  type Segment,
} from '../components/matches/SegmentedTabs';
import SportSelector from '../components/home/SportSelector';
import { FadeInView } from '../components/ui';
import { cities, isInArea, sports, type OpenMatch } from '../data';
import { useMatches } from '../matches/MatchesContext';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight, leading } from '../theme/typography';

/** Clears the floating tab bar so the last row is never hidden behind it. */
const TAB_BAR_CLEARANCE = 96;

const SEGMENTS: Segment[] = [
  { id: 'nearby', label: 'Nearby' },
  { id: 'requests', label: 'My requests' },
  { id: 'mine', label: 'My matches' },
];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { matches: openMatches, ownedIds, requestedIds } = useMatches();
  const [segment, setSegment] = useState('nearby');
  const [sportId, setSportId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Matches follow the same city the rest of the app is scoped to.
  const cityId = cities[0].id;
  const cityAreaId = cities[0].areas[0].id;

  const inCity = useMemo(
    () =>
      openMatches.filter((match) =>
        isInArea(match.area, cityId, cityAreaId),
      ),
    [openMatches, cityId, cityAreaId],
  );

  const bySegment = useMemo(() => {
    if (segment === 'requests') {
      return inCity.filter((match) => requestedIds.includes(match.id));
    }
    if (segment === 'mine') {
      return inCity.filter((match) => ownedIds.includes(match.id));
    }
    return inCity;
  }, [inCity, segment, ownedIds, requestedIds]);

  const visible = useMemo(
    () =>
      sportId ? bySegment.filter((match) => match.sportId === sportId) : bySegment,
    [bySegment, sportId],
  );

  const segments = useMemo<Segment[]>(
    () =>
      SEGMENTS.map((item) => ({
        ...item,
        count:
          item.id === 'requests'
            ? inCity.filter((m) => requestedIds.includes(m.id)).length
            : item.id === 'mine'
              ? inCity.filter((m) => ownedIds.includes(m.id)).length
              : undefined,
      })),
    [inCity, ownedIds, requestedIds],
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Placeholder until a real data layer exists.
    setTimeout(() => setRefreshing(false), 800);
  };

  const emptyCopy = (): { title: string; body: string } => {
    if (segment === 'requests') {
      return {
        title: 'No requests yet',
        body: 'Matches you ask to join will show up here.',
      };
    }
    if (segment === 'mine') {
      return {
        title: 'You have not created a match',
        body: 'Post a game and let nearby players request to join.',
      };
    }
    return {
      title: 'No open matches',
      body: sportId
        ? 'Try another sport, or create the first match.'
        : 'Be the first to post a game in your area.',
    };
  };

  const empty = emptyCopy();

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
      data={visible}
      keyExtractor={(item: OpenMatch) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Open matches</Text>
              <Text style={styles.subtitle}>
                {visible.length > 0
                  ? `${visible.length} ${
                      visible.length === 1 ? 'game' : 'games'
                    } near you`
                  : 'Games near you that need players'}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create match"
              style={({ pressed }) => [
                styles.createBtn,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="add" size={22} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.tabs}>
            <SegmentedTabs
              segments={segments}
              selectedId={segment}
              onSelect={setSegment}
            />
          </View>

          <View style={styles.sports}>
            <SportSelector
              sports={sports}
              selectedId={sportId ?? ''}
              onSelect={(id) => setSportId((prev) => (prev === id ? null : id))}
              embedded
            />
          </View>
        </View>
      }
      ListEmptyComponent={
        <FadeInView style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="people-outline" size={26} color={colors.muted} />
          </View>
          <Text style={styles.emptyTitle}>{empty.title}</Text>
          <Text style={styles.emptyBody}>{empty.body}</Text>
        </FadeInView>
      }
      renderItem={({ item, index }) => (
        <FadeInView delay={Math.min(index, 4) * 40} style={styles.item}>
          <OpenMatchCard match={item} layout="wide" />
        </FadeInView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: {},
  header: {
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: fontSize.screenTitle,
    lineHeight: leading(fontSize.screenTitle, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
  },
  createBtn: {
    width: 42,
    height: 42,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },

  tabs: { paddingHorizontal: screenPadding, marginTop: spacing.lg },
  sports: { marginTop: spacing.md },

  item: { paddingHorizontal: screenPadding, paddingBottom: spacing.md },

  empty: {
    marginTop: spacing['3xl'],
    paddingHorizontal: screenPadding,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    // Half of width/height — a circle, not a radius-token value.
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.bodyLarge,
    lineHeight: leading(fontSize.bodyLarge, 1.3),
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyBody: {
    fontSize: fontSize.footnote,
    lineHeight: leading(fontSize.footnote),
    color: colors.muted,
    textAlign: 'center',
  },
});
