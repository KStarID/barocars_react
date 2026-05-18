import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isSeller: boolean;
  becomeSeller: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isSeller: false,
  becomeSeller: () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Check localStorage for seller role
        const role = localStorage.getItem(`role_${user.uid}`);
        setIsSeller(role === 'seller');
      } else {
        setIsSeller(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const becomeSeller = () => {
    if (currentUser) {
      localStorage.setItem(`role_${currentUser.uid}`, 'seller');
      setIsSeller(true);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, isSeller, becomeSeller, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
