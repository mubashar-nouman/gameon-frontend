import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearSession,
  loadSession,
  saveSession,
  type StoredSession,
} from './storage';

type SessionState = {
  /** True until the stored session has been read — hold the splash till then. */
  loading: boolean;
  session: StoredSession | null;
  signIn: (session: Omit<StoredSession, 'userId' | 'createdAt'>) => Promise<void>;
  signOut: () => Promise<void>;
  update: (patch: Partial<Omit<StoredSession, 'userId' | 'createdAt'>>) => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    let active = true;
    void loadSession().then((stored) => {
      // Ignore a late resolve after unmount, which would set state on a dead
      // component.
      if (!active) return;
      setSession(stored);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(
    async (input: Omit<StoredSession, 'userId' | 'createdAt'>) => {
      const next: StoredSession = {
        ...input,
        // Stand-in until a backend issues real ids.
        userId: 'u1',
        createdAt: new Date().toISOString(),
      };
      setSession(next);
      await saveSession(next);
    },
    [],
  );

  const signOut = useCallback(async () => {
    setSession(null);
    await clearSession();
  }, []);

  // Derives from the current session rather than reading it back out of the
  // state updater, which is not guaranteed to have run by the time we persist.
  const update = useCallback(
    async (patch: Partial<Omit<StoredSession, 'userId' | 'createdAt'>>) => {
      if (!session) return;
      const next: StoredSession = { ...session, ...patch };
      setSession(next);
      await saveSession(next);
    },
    [session],
  );

  const value = useMemo(
    () => ({ loading, session, signIn, signOut, update }),
    [loading, session, signIn, signOut, update],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return ctx;
}
