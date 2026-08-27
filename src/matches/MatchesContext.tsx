import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { openMatches as seedMatches, type OpenMatch } from '../data';

/** Fields the create form supplies; the rest are derived on save. */
export type NewMatchInput = {
  sportId: string;
  title: string;
  area: string;
  time: string;
  pricePerPlayer: number;
  skillLevel: string;
  playersNeeded: number;
  /** Whether the host counts themselves as the first player. */
  hostPlaying: boolean;
};

type MatchesState = {
  /** Seeded matches plus anything created this run, newest first. */
  matches: OpenMatch[];
  /** Ids the signed-in user created. */
  ownedIds: string[];
  /** Ids the signed-in user asked to join. */
  requestedIds: string[];
  createMatch: (input: NewMatchInput) => OpenMatch;
  requestToJoin: (matchId: string) => void;
  cancelMatch: (matchId: string) => void;
};

const MatchesContext = createContext<MatchesState | null>(null);

/** Seeded stubs, kept so the segments are not empty on a fresh install. */
const SEED_OWNED = ['m1', 'm7'];
const SEED_REQUESTED = ['m2', 'm5'];

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [created, setCreated] = useState<OpenMatch[]>([]);
  const [ownedIds, setOwnedIds] = useState<string[]>(SEED_OWNED);
  const [requestedIds, setRequestedIds] = useState<string[]>(SEED_REQUESTED);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);

  // Created matches lead so a new one is visible without scrolling.
  const matches = useMemo(
    () =>
      [...created, ...seedMatches].filter(
        (match) => !cancelledIds.includes(match.id),
      ),
    [created, cancelledIds],
  );

  const createMatch = useCallback((input: NewMatchInput): OpenMatch => {
    const match: OpenMatch = {
      // Prefixed so a created id can never collide with a seeded one.
      id: `new-${Date.now()}`,
      sportId: input.sportId,
      title: input.title,
      area: input.area,
      time: input.time,
      pricePerPlayer: input.pricePerPlayer,
      skillLevel: input.skillLevel,
      playersJoined: input.hostPlaying ? 1 : 0,
      playersNeeded: input.playersNeeded,
    };
    setCreated((prev) => [match, ...prev]);
    setOwnedIds((prev) => [match.id, ...prev]);
    return match;
  }, []);

  const requestToJoin = useCallback((matchId: string) => {
    setRequestedIds((prev) =>
      prev.includes(matchId) ? prev : [matchId, ...prev],
    );
  }, []);

  const cancelMatch = useCallback((matchId: string) => {
    setCancelledIds((prev) =>
      prev.includes(matchId) ? prev : [matchId, ...prev],
    );
    setOwnedIds((prev) => prev.filter((id) => id !== matchId));
  }, []);

  const value = useMemo(
    () => ({
      matches,
      ownedIds,
      requestedIds,
      createMatch,
      requestToJoin,
      cancelMatch,
    }),
    [matches, ownedIds, requestedIds, createMatch, requestToJoin, cancelMatch],
  );

  return (
    <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>
  );
}

export function useMatches(): MatchesState {
  const ctx = useContext(MatchesContext);
  if (!ctx) {
    throw new Error('useMatches must be used inside a MatchesProvider');
  }
  return ctx;
}
