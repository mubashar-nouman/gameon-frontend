export type DiscoverStackParamList = {
  Discover: undefined;
  ArenaDetail: { arenaId: string };
  Notifications: undefined;
};

export type RootTabParamList = {
  DiscoverTab: undefined;
  Matches: undefined;
  Bookings: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
