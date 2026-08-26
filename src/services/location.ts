import * as Location from 'expo-location';

import { allAreas, type Area, type City } from '../data';

export type LocateResult =
  | { status: 'success'; city: City; area: Area; distanceKm: number }
  | { status: 'out-of-range'; nearestCity: City; distanceKm: number }
  | { status: 'denied' }
  | { status: 'unavailable' };

const EARTH_RADIUS_KM = 6371;

/**
 * Beyond this, the nearest launched area is not plausibly "where you are", so
 * we say so instead of silently dropping the user in another city.
 */
const MAX_MATCH_KM = 60;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

/** Great-circle distance between two coordinates, in kilometres. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a));
}

/** Closest area across every city to the given point. */
export function nearestArea(
  lat: number,
  lng: number,
): { city: City; area: Area; distanceKm: number } | undefined {
  const candidates = allAreas();
  if (candidates.length === 0) return undefined;

  let best = candidates[0];
  let bestDistance = distanceKm(lat, lng, best.area.lat, best.area.lng);

  candidates.slice(1).forEach((candidate) => {
    const d = distanceKm(lat, lng, candidate.area.lat, candidate.area.lng);
    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  });

  return { city: best.city, area: best.area, distanceKm: bestDistance };
}

/**
 * Asks for permission, takes a GPS fix, and maps it to the nearest known area.
 * Never throws — the caller renders from the returned status.
 */
export async function locateNearestArea(): Promise<LocateResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      return { status: 'denied' };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const match = nearestArea(
      position.coords.latitude,
      position.coords.longitude,
    );

    if (!match) return { status: 'unavailable' };

    if (match.distanceKm > MAX_MATCH_KM) {
      return {
        status: 'out-of-range',
        nearestCity: match.city,
        distanceKm: match.distanceKm,
      };
    }

    return {
      status: 'success',
      city: match.city,
      area: match.area,
      distanceKm: match.distanceKm,
    };
  } catch {
    return { status: 'unavailable' };
  }
}
