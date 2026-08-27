export type DiscoverStackParamList = {
  Discover: undefined;
  ArenaDetail: { arenaId: string };
  Notifications: undefined;
};

export type AuthStackParamList = {
  Phone: undefined;
  /** National 10-digit number, carried forward for display and storage. */
  Otp: { phone: string };
  ProfileSetup: { phone: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Help: undefined;
  About: undefined;
};

/**
 * Sits above the tabs so modal-style screens cover the floating tab bar.
 */
export type RootStackParamList = {
  Tabs: { screen?: keyof RootTabParamList } | undefined;
  CreateMatch: undefined;
  MatchCreated: { matchId: string };
};

export type RootTabParamList = {
  DiscoverTab: undefined;
  Matches: undefined;
  Bookings: undefined;
  ProfileTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
