import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Bumping this invalidates every stored session at once — use it when the
 * shape of StoredSession changes incompatibly.
 */
const KEY = 'gameon.session.v1';

export type StoredSession = {
  userId: string;
  phone: string;
  name: string;
  homeArea: string;
  /** ISO 8601. */
  createdAt: string;
};

/**
 * A malformed or partial record is treated as no session at all: a half-built
 * user would fail further into the app, where the cause is much harder to see.
 */
function isSession(value: unknown): value is StoredSession {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.userId === 'string' &&
    typeof s.phone === 'string' &&
    typeof s.name === 'string' &&
    typeof s.homeArea === 'string' &&
    typeof s.createdAt === 'string'
  );
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    // Unreadable storage must not block startup — fall back to signed out.
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Non-fatal: the session stays valid in memory for this run.
  }
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Non-fatal — the in-memory sign-out still takes effect.
  }
}
