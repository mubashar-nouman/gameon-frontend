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

export type RootTabParamList = {
  DiscoverTab: undefined;
  Matches: undefined;
  Bookings: undefined;
  ProfileTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
