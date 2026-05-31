import { createContext } from 'react';

export type AuthContextType = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
};

// Archivo .ts (sin JSX) — solo la definición del contexto, sin componentes.
// Así AuthContext.tsx puede exportar solo AuthProvider y useAuth.ts solo el hook,
// satisfaciendo la regla react-refresh/only-export-components en ambos archivos.
export const AuthContext = createContext<AuthContextType | null>(null);
