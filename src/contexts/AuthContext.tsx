import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { login as apiLogin, getToken, clearToken, setOnUnauthorized } from "@/services/api";
import type { LoginResult } from "@/types/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  admin: LoginResult["admin"] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "admin_token";
const ADMIN_KEY = "admin_user";

function loadStored(): { token: string; admin: LoginResult["admin"] } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const adminJson = localStorage.getItem(ADMIN_KEY);
  if (!token || !adminJson) return null;
  try {
    const admin = JSON.parse(adminJson) as LoginResult["admin"];
    return { token, admin };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    admin: LoginResult["admin"] | null;
  }>(() => {
    const stored = loadStored();
    if (stored) {
      return { admin: stored.admin };
    }
    return { admin: null };
  });

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(result.admin));
    setState({ admin: result.admin });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(ADMIN_KEY);
    setState({ admin: null });
  }, []);

  const isAuthenticated = getToken() != null && state.admin != null;

  useMemo(() => {
    setOnUnauthorized(logout);
  }, [logout]);

  const value: AuthContextValue = useMemo(
    () => ({ isAuthenticated, admin: state.admin, login, logout }),
    [isAuthenticated, state.admin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
