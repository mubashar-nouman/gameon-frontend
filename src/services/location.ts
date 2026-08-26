import * as Location from 'expo-location';

import { areas, type Area } from '../data';

export type LocateResult =
  | { status: 'success'; area: Area; distanceKm: number }
  | { status: 'denied' }
  | { status: 'unavailable' };

const EARTH_RADIUS_KM = 6371;

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

/** Closest area with coordinates to the given point. */
export function nearestArea(
  lat: number,
  lng: number,
): { area: Area; distanceKm: number } | undefined {
  const located = areas.filter(
    (area): area is Area & { lat: number; lng: number } =>
      typeof area.lat === 'number' && typeof area.lng === 'number',
  );

  if (located.length === 0) return undefined;

  let best = located[0];
  let bestDistance = distanceKm(lat, lng, best.lat, best.lng);

  located.slice(1).forEach((area) => {
    const d = distanceKm(lat, lng, area.lat, area.lng);
    if (d < bestDistance) {
      best = area;
      bestDistance = d;
    }
  });

  return { area: best, distanceKm: bestDistance };
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

    return {
      status: 'success',
      area: match.area,
      distanceKm: match.distanceKm,
    };
  } catch {
    return { status: 'unavailable' };
  }
}
