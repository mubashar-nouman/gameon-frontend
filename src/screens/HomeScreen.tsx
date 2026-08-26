import { useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
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
import ArenaFilterSheet, { type SortOption } from '../components/home/ArenaFilterSheet';
import HomeBannerCarousel from '../components/home/HomeBannerCarousel';
import MatchInviteBanner from '../components/home/MatchInviteBanner';
import LocationSheet from '../components/home/LocationSheet';
import { locateNearestArea } from '../services/location';
import SectionHeader from '../components/home/SectionHeader';
import SportSelector from '../components/home/SportSelector';
import { FadeInView, Card } from '../components/ui';
import {
  arenas,
  cities,
  getArea,
  getCity,
  isInArea,
  openMatches,
  sports,
  user,
} from '../data';
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
  const [locationOpen, setLocationOpen] = useState(false);
  const [cityId, setCityId] = useState(cities[0].id);
  const [areaId, setAreaId] = useState(cities[0].areas[0].id);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | undefined>();
  const scrollRef = useRef<ScrollView>(null);
  const arenaSectionY = useRef(0);

  const selectedSport = sports.find((s) => s.id === selectedSportId);

  const selectedCity = getCity(cityId);
  const selectedArea = getArea(cityId, areaId);
  /** True when the whole city is selected rather than one area. */
  const wholeCity = (selectedArea?.matches.length ?? 0) === 0;
  const locationLabel = wholeCity
    ? selectedCity?.name
    : `${selectedArea?.name}, ${selectedCity?.name}`;

  const visibleMatches = useMemo(
    () =>
      openMatches.filter(
        (match) =>
          match.sportId === selectedSportId &&
          isInArea(match.area, cityId, areaId),
      ),
    [selectedSportId, cityId, areaId],
  );

  /** Distance to the arena hosting the closest open match, if we can match one. */
  const nearestMatchKm = useMemo(() => {
    const distances = visibleMatches
      .map((match) => arenas.find((item) => item.area === match.area)?.distanceKm)
      .filter((value): value is number => typeof value === 'number');

    return distances.length > 0 ? Math.min(...distances) : undefined;
  }, [visibleMatches]);

  /** Arena count per "cityId:areaId", for the picker rows. */
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cities.forEach((city) => {
      city.areas.forEach((area) => {
        counts[`${city.id}:${area.id}`] = arenas.filter((arena) =>
          isInArea(arena.area, city.id, area.id),
        ).length;
      });
    });
    return counts;
  }, []);

  const visibleArenas = useMemo(() => {
    const bySport = arenas.filter(
      (arena) =>
        arena.sportId === selectedSportId &&
        isInArea(arena.area, cityId, areaId),
    );
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
  }, [selectedSportId, query, sortBy, cityId, areaId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const toggleSaved = (id: string) =>
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));

  const openArena = (id: string) =>
    navigation.navigate('ArenaDetail', { arenaId: id });

  const goToMatches = () => navigation.getParent()?.navigate('Matches');

  const applySort = (option: SortOption) => setSortBy(option);

  const scrollToArenas = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(arenaSectionY.current - spacing.lg, 0),
      animated: true,
    });
  };

  const handleUseCurrentLocation = useCallback(async () => {
    setLocating(true);
    setLocateError(undefined);

    const result = await locateNearestArea();

    if (result.status === 'success') {
      setCityId(result.city.id);
      setAreaId(result.area.id);
      setLocationOpen(false);
    } else if (result.status === 'out-of-range') {
      setLocateError(
        `We are not in your area yet — GameOn is live in ${result.nearestCity.name} only.`,
      );
    } else if (result.status === 'denied') {
      setLocateError('Location permission denied. Pick an area below.');
    } else {
      setLocateError('Could not get your location. Pick an area below.');
    }

    setLocating(false);
  }, []);

  const sortActive = sortBy !== 'nearest';

  return (
    <View style={styles.root}>
      <View style={[styles.statusBarFill, { height: insets.top }]} />
      <LocationSheet
        visible={locationOpen}
        cityId={cityId}
        areaId={areaId}
        counts={areaCounts}
        onClose={() => setLocationOpen(false)}
        onSelect={(nextCityId, nextAreaId) => {
          setCityId(nextCityId);
          setAreaId(nextAreaId);
          setLocationOpen(false);
        }}
        onUseCurrentLocation={handleUseCurrentLocation}
        locating={locating}
        locateError={locateError}
      />

      <ArenaFilterSheet
        visible={filtersOpen}
        value={sortBy}
        resultCount={visibleArenas.length}
        onClose={() => setFiltersOpen(false)}
        onApply={applySort}
      />
      <ScrollView
        ref={scrollRef}
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
              onPress={() => setLocationOpen(true)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.locationRow,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="location-sharp" size={12} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {locationLabel ?? user.location}
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
              hitSlop={8}
              onPress={() => setFiltersOpen(true)}
              style={({ pressed }) => [
                styles.filterBtn,
                sortActive && styles.filterBtnActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="options-outline"
                size={17}
                color={sortActive ? colors.primary : colors.text}
              />
            </Pressable>
          </View>
          </Card>
        </FadeInView>

        <FadeInView style={styles.sports}>
          <SportSelector
            sports={sports}
            selectedId={selectedSportId}
            onSelect={setSelectedSportId}
          />
        </FadeInView>

        <FadeInView delay={20}>
          <HomeBannerCarousel
            onExploreMatches={goToMatches}
            onBrowseArenas={scrollToArenas}
            onCreateMatch={goToMatches}
          />
        </FadeInView>

        <FadeInView delay={40} style={styles.matchesBanner}>
          <MatchInviteBanner
            matches={visibleMatches}
            nearestKm={nearestMatchKm}
            sportName={selectedSport?.name ?? ''}
            areaLabel={wholeCity ? selectedCity?.name : selectedArea?.name}
            onPress={goToMatches}
          />
        </FadeInView>

        <View
          onLayout={(event) => {
            arenaSectionY.current = event.nativeEvent.layout.y;
          }}
        >
          <FadeInView delay={80} style={styles.arenaSection}>
          <SectionHeader
            title="Nearby arenas"
            subtitle={
              visibleArenas.length > 0
                ? `${visibleArenas.length} ${
                    visibleArenas.length === 1 ? 'ground' : 'grounds'
                  } in ${wholeCity ? selectedCity?.name : selectedArea?.name}`
                : 'Courts and grounds around your area'
            }
            tone="brand"
            actionLabel={visibleArenas.length > 0 ? 'See all' : undefined}
          />

          {visibleArenas.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={22} color={colors.muted} />
              <Text style={styles.emptyTitle}>No arenas found</Text>
              <Text style={styles.emptyText}>
                {`No ${selectedSport?.name.toLowerCase()} arenas in ${
                  wholeCity ? selectedCity?.name : selectedArea?.name
                }.`}
              </Text>
              {!wholeCity ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setAreaId(selectedCity?.areas[0].id ?? areaId)}
                  hitSlop={6}
                  style={({ pressed }) => [pressed && styles.pressed]}
                >
                  <Text style={styles.emptyAction}>Search all of {selectedCity?.name}</Text>
                </Pressable>
              ) : null}
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
        </View>
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
  sports: { marginTop: spacing.lg },
  section: { marginTop: spacing.xl, gap: spacing.md },
  arenaSection: { marginTop: spacing.xl, gap: spacing.md },
  matchesBanner: { marginTop: spacing['2xl'] },
  carousel: {
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  arenaList: {
    paddingHorizontal: screenPadding,
    gap: spacing.md,
  },
  empty: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyAction: {
    marginTop: spacing.sm,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
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
