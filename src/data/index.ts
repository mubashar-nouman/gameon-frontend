/**
 * Typed access to the editable Home dummy data in `src/dummy-data/`.
 *
 * Those JSON files are the editable source of truth — add or change entries
 * there by hand and the app picks them up on reload. This module only attaches
 * types and joins records by `sportId`.
 */
import citiesJson from '../dummy-data/home-cities.json';
import arenasJson from '../dummy-data/home-arenas.json';
import bookingDatesJson from './json/bookingDates.json';
import bookingsJson from './json/bookings.json';
import openMatchesJson from '../dummy-data/home-open-matches.json';
import slotsJson from './json/slots.json';
import sportsJson from '../dummy-data/home-sports.json';
import userJson from '../dummy-data/home-user.json';

export type Sport = {
  id: string;
  name: string;
  emoji: string;
  icon: string;
};

export type Arena = {
  id: string;
  name: string;
  area: string;
  sportId: string;
  grounds: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  availableWindows: string[];
  activeWindow: string;
  facilities: string[];
};

export type OpenMatch = {
  id: string;
  sportId: string;
  title: string;
  area: string;
  time: string;
  pricePerPlayer: number;
  skillLevel: string;
  playersJoined: number;
  playersNeeded: number;
};

export type Booking = {
  id: string;
  arenaId: string;
  arenaName: string;
  area: string;
  date: string;
  time: string;
  price: number;
  status: string;
};

export type Slot = {
  id: string;
  time: string;
  price: number;
  status: string;
  peak?: boolean;
};

export type BookingDate = {
  id: string;
  label: string;
  day: string;
};

export type Area = {
  id: string;
  name: string;
  /** Area-name prefixes that belong to this area; empty means the whole city. */
  matches: string[];
  lat: number;
  lng: number;
};

export type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Cities we have not launched in yet are shown but not selectable. */
  enabled: boolean;
  areas: Area[];
};
export type User = {
  id: string;
  firstName: string;
  fullName: string;
  location: string;
  hasUnreadNotifications: boolean;
};

export const sports: Sport[] = sportsJson;
export const arenas: Arena[] = arenasJson;
export const openMatches: OpenMatch[] = openMatchesJson;
export const cities: City[] = citiesJson;
export const user: User = userJson;
export const bookings: Booking[] = bookingsJson;
export const slots: Slot[] = slotsJson;
export const bookingDates: BookingDate[] = bookingDatesJson;

export function getCity(cityId: string): City | undefined {
  return cities.find((city) => city.id === cityId);
}

export function getArea(cityId: string, areaId: string): Area | undefined {
  return getCity(cityId)?.areas.find((area) => area.id === areaId);
}

/**
 * Every area we can actually send a user to. Disabled cities are excluded so a
 * GPS fix never lands somewhere the picker will not let them select.
 */
export function allAreas(): { city: City; area: Area }[] {
  return cities
    .filter((city) => city.enabled)
    .flatMap((city) =>
    city.areas
      // "All areas" carries the city centre, so it is not a real destination.
      .filter((area) => area.matches.length > 0)
      .map((area) => ({ city, area })),
  );
}

/**
 * True when a record belongs to the selected city, and to the selected area
 * within it. An area with no prefixes matches the whole city.
 */
export function isInArea(
  recordArea: string,
  cityId: string,
  areaId: string,
): boolean {
  const city = getCity(cityId);
  if (!city) return true;

  // Records are stored as "<Area>, <City>".
  if (!recordArea.endsWith(city.name)) return false;

  const area = getArea(cityId, areaId);
  if (!area || area.matches.length === 0) return true;

  return area.matches.some((prefix) => recordArea.startsWith(prefix));
}

export function getArena(arenaId: string): Arena | undefined {
  return arenas.find((arena) => arena.id === arenaId);
}

export function getSport(sportId: string): Sport | undefined {
  return sports.find((sport) => sport.id === sportId);
}

/** Formats to the PKR convention used across the app: "Rs. 6,000". */
export function formatPkr(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
