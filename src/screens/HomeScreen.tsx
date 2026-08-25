import { useCallback, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ArenaCard from '../components/home/ArenaCard';
import ArenaSortPanel, { type SortOption } from '../components/home/ArenaSortPanel';
import OpenMatchCard from '../components/home/OpenMatchCard';
import SectionHeader from '../components/home/SectionHeader';
import SportSelector from '../components/home/SportSelector';
import { FadeInView, Card } from '../components/ui';
import { arenas, openMatches, sports, user } from '../data';
import type { DiscoverStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { screenPadding, spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Discover'>;

const TAB_BAR_CLEARANCE = 96;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedSportId, setSelectedSportId] = useState(sports[0].id);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<SortOption>('nearest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedSport = sports.find((s) => s.id === selectedSportId);

  const visibleMatches = useMemo(
    () => openMatches.filter((match) => match.sportId === selectedSportId),
    [selectedSportId],
  );

  const visibleArenas = useMemo(() => {
    const bySport = arenas.filter((arena) => arena.sportId === selectedSportId);
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? bySport
      : bySport.filter(
          (arena) =>
            arena.name.toLowerCase().includes(q) ||
            arena.area.toLowerCase().includes(q),
        );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      if (sortBy === 'price') return a.pricePerHour - b.pricePerHour;
      return b.rating - a.rating;
    });
  }, [selectedSportId, query, sortBy]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const toggleSaved = (id: string) =>
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));

  const openArena = (id: string) =>
    navigation.navigate('ArenaDetail', { arenaId: id });

  const goToMatches = () => navigation.getParent()?.navigate('Matches');

  const selectSort = (option: SortOption) => {
    setSortBy(option);
    setFiltersOpen(false);
  };

  const sortActive = sortBy !== 'nearest';

  return (
    <View style={styles.root}>
      <View style={[styles.statusBarFill, { height: insets.top }]} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: spacing.sm,
            paddingBottom: TAB_BAR_CLEARANCE + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color={colors.muted} />
          </View>

          <View style={styles.greetingText}>
            <Text style={styles.greeting}>Hi, {user.firstName}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change location"
              style={styles.locationRow}
            >
              <Ionicons name="location-sharp" size={12} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {user.location}
              </Text>
              <Ionicons name="chevron-down" size={11} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.text} />
            {user.hasUnreadNotifications ? <View style={styles.dot} /> : null}
          </Pressable>
        </View>

        <FadeInView style={styles.discoveryPanel}>
          <Card variant="outline">
            <View style={styles.searchField}>
            <Ionicons name="search-outline" size={16} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search arenas in Lahore..."
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            <View style={styles.searchDivider} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sort and filters"
              accessibilityState={{ expanded: filtersOpen }}
              hitSlop={8}
              onPress={() => setFiltersOpen((open) => !open)}
              style={({ pressed }) => [
                styles.filterBtn,
                (filtersOpen || sortActive) && styles.filterBtnActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="options-outline"
                size={17}
                color={filtersOpen || sortActive ? colors.primary : colors.text}
              />
            </Pressable>
          </View>

          {filtersOpen ? (
            <>
              <View style={styles.panelDivider} />
              <ArenaSortPanel value={sortBy} onChange={selectSort} />
            </>
          ) : null}
          </Card>
        </FadeInView>

        <FadeInView style={styles.sports}>
          <SportSelector
            sports={sports}
            selectedId={selectedSportId}
            onSelect={setSelectedSportId}
          />
        </FadeInView>

        <FadeInView delay={40} style={styles.section}>
          <SectionHeader
            title="Open matches"
            subtitle="Games near you that need players"
            actionLabel="See all"
            onActionPress={goToMatches}
          />

          {visibleMatches.length === 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={goToMatches}
              style={({ pressed }) => [styles.matchesEmptyWrap, pressed && styles.pressed]}
            >
              <Card variant="outline" style={styles.matchesEmpty}>
                <Text style={styles.matchesEmptyEmoji}>{selectedSport?.emoji}</Text>
                <View style={styles.matchesEmptyText}>
                  <Text style={styles.matchesEmptyTitle}>
                    No {selectedSport?.name.toLowerCase()} matches yet
                  </Text>
                  <Text style={styles.matchesEmptyBody}>
                    Tap + below to create one, or browse all matches
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </Card>
            </Pressable>
          ) : (
            <FlatList
              horizontal
              data={visibleMatches}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <OpenMatchCard match={item} onJoin={goToMatches} />
              )}
            />
          )}
        </FadeInView>

        <FadeInView delay={80} style={styles.arenaSection}>
          <SectionHeader
            title="Nearby arenas"
            subtitle="Courts and grounds around your area"
            actionLabel={visibleArenas.length > 0 ? 'See all' : undefined}
          />

          {visibleArenas.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={22} color={colors.muted} />
              <Text style={styles.emptyTitle}>No arenas found</Text>
              <Text style={styles.emptyText}>
                Try another sport or clear your search.
              </Text>
            </View>
          ) : (
            <View style={styles.arenaList}>
              {visibleArenas.map((item) => (
                <ArenaCard
                  key={item.id}
                  arena={item}
                  saved={saved[item.id]}
                  onToggleSave={() => toggleSaved(item.id)}
                  onPress={() => openArena(item.id)}
                />
              ))}
            </View>
          )}
        </FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pageBackground },
  statusBarFill: { backgroundColor: colors.pageBackground },
  screen: { flex: 1, backgroundColor: colors.pageBackground },
  content: {},
  header: {
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: { flex: 1, gap: 2 },
  greeting: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.muted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  locationText: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    maxWidth: 200,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.65 },
  dot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.white,
    backgroundColor: colors.primary,
  },
  discoveryPanel: {
    marginHorizontal: screenPadding,
  },
  searchField: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.regular,
    color: colors.text,
    padding: 0,
  },
  searchDivider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: colors.borderSubtle,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  panelDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSubtle,
  },
  sports: { marginTop: spacing.lg },
  section: { marginTop: spacing.xl, gap: spacing.md },
  arenaSection: { marginTop: spacing.xl, gap: spacing.md },
  carousel: {
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  arenaList: {
    paddingHorizontal: screenPadding,
    gap: spacing.lg,
  },
  matchesEmptyWrap: {
    marginHorizontal: screenPadding,
  },
  matchesEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  matchesEmptyEmoji: { fontSize: 22 },
  matchesEmptyText: { flex: 1, gap: 2 },
  matchesEmptyTitle: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  matchesEmptyBody: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  empty: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  emptyText: {
    fontSize: fontSize.caption,
    color: colors.muted,
    textAlign: 'center',
  },
});
