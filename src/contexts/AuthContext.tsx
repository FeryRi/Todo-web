import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContextDef';
import { logout as firebaseLogout } from '../services/auth/AuthServices';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: localStorage es síncrono, no necesita useEffect
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem('userToken')
  );

  const setToken = (t: string) => {
    localStorage.setItem('userToken', t);
    setTokenState(t);
  };

  const logout = async () => {
    await firebaseLogout();
    localStorage.removeItem('userToken');
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
