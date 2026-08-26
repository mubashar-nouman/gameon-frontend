import { useEffect, useState } from 'react';
import { Platform, StatusBar as RNStatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayfairDisplay_700Bold, useFonts } from '@expo-google-fonts/playfair-display';
import * as NativeSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ArenaDetailScreen from './src/screens/ArenaDetailScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import HomeScreen from './src/screens/HomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import FloatingTabBar from './src/components/navigation/FloatingTabBar';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type {
  DiscoverStackParamList,
  RootTabParamList,
} from './src/navigation/types';
import { colors } from './src/theme/colors';

// Keep the native splash up until our own splash is rendered, so there is no
// blank flash between the two.
void NativeSplashScreen.preventAutoHideAsync();

if (Platform.OS === 'android') {
  RNStatusBar.setBackgroundColor(colors.pageBackground);
  RNStatusBar.setBarStyle('dark-content');
  RNStatusBar.setTranslucent(false);
}

const Tab = createBottomTabNavigator<RootTabParamList>();
const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.pageBackground,
    card: colors.pageBackground,
  },
};

const tabIcons: Record<
  keyof RootTabParamList,
  { outline: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }
> = {
  DiscoverTab: { outline: 'home-outline', filled: 'home' },
  Matches: { outline: 'people-outline', filled: 'people' },
  Bookings: { outline: 'calendar-outline', filled: 'calendar' },
  Profile: { outline: 'person-outline', filled: 'person' },
};

const tabLabels: Record<keyof RootTabParamList, string> = {
  DiscoverTab: 'Home',
  Matches: 'Matches',
  Bookings: 'Bookings',
  Profile: 'Profile',
};

function DiscoverNavigator() {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen
        name="Discover"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <DiscoverStack.Screen
        name="ArenaDetail"
        component={ArenaDetailScreen}
        options={{
          // The screen draws its own back control over the hero image.
          headerShown: false,
        }}
      />
    </DiscoverStack.Navigator>
  );
}

export default function App() {
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold });

  useEffect(() => {
    // Hold the native splash until the brand font is ready, so the headline
    // never renders in the fallback face first.
    if (fontsLoaded) {
      void NativeSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // This callback has no dependency on render state, so it does not need to
  // be a hook. Keeping startup hooks limited to state/font loading/effects
  // also makes Fast Refresh safe while the font is resolving.
  const handleSplashFinish = () => setIsSplashDone(true);

  // Every hook must run before this early return, or the hook order changes
  // between the unloaded and loaded renders.
  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider style={styles.root}>
        {isSplashDone ? (
          <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
              tabBar={(props) => (
                <FloatingTabBar
                  {...props}
                  icons={tabIcons}
                  labels={tabLabels}
                />
              )}
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                sceneStyle: styles.root,
              }}
            >
              <Tab.Screen
                name="DiscoverTab"
                component={DiscoverNavigator}
                options={({ route }) => ({
                  title: 'Home',
                  // Arena detail owns the bottom of the screen with its own
                  // booking bar, so the floating tabs would sit on top of it.
                  tabBarStyle: {
                    display:
                      getFocusedRouteNameFromRoute(route) === 'ArenaDetail'
                        ? 'none'
                        : 'flex',
                  },
                })}
              />
              <Tab.Screen name="Matches" component={MatchesScreen} />
              <Tab.Screen name="Bookings" component={BookingsScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        ) : (
          <SplashScreen onFinish={handleSplashFinish} />
        )}
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pageBackground },
});
