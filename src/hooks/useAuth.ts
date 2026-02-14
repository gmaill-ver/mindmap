import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged, signInWithPopup, signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '../db/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  return { user, loading, signInWithGoogle, signOut };
}
