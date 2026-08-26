import type { ImageSourcePropType } from 'react-native';

/**
 * Photography for arena cards, keyed by sport.
 *
 * Several arenas share a sport, so each sport holds a list and the arena's
 * position within its sport picks one — that way neighbouring cards do not
 * repeat the same photo. Sports with no entry fall back to the drawn
 * `SportArt` illustration.
 *
 * `require` paths must be static literals; Metro resolves them at build time.
 */
const bySport: Record<string, ImageSourcePropType[]> = {
  football: [
    require('../../assets/arenas/football1.jpg'),
    require('../../assets/arenas/3.jpg'),
  ],
  cricket: [
    require('../../assets/arenas/1.jpg'),
    require('../../assets/arenas/2.jpg'),
  ],
  padel: [
    require('../../assets/arenas/padel2.jpg'),
    require('../../assets/arenas/padel1.jpg'),
    require('../../assets/arenas/padel.jpg'),
  ],
  // No badminton or basketball photos yet — those keep the SportArt fallback.
};

/**
 * @param sportId  Sport the arena belongs to.
 * @param variant  Any stable number for the arena (its index within the
 *                 sport); used to spread photos across cards.
 */
export function getArenaImage(
  sportId: string,
  variant = 0,
): ImageSourcePropType | undefined {
  const options = bySport[sportId];
  if (!options || options.length === 0) return undefined;
  return options[variant % options.length];
}
