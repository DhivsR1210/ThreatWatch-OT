import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await api.post("/auth/logout");
      }
    } catch {
      // Clearing local state is sufficient if a token has already expired.
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { access_token: accessToken, user: authenticatedUser } = response.data.data;
    setAccessToken(accessToken);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback(
    async (details) => {
      await api.post("/auth/register", details);
      return login({ email: details.email, password: details.password });
    },
    [login],
  );

  const refreshProfile = useCallback(async () => {
    const response = await api.get("/auth/profile");
    setUser(response.data.data.user);
    return response.data.data.user;
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }

    refreshProfile().catch(() => {
      clearAccessToken();
      setUser(null);
    }).finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const value = useMemo(
    () => ({ user, isLoading, login, logout, register, refreshProfile }),
    [isLoading, login, logout, refreshProfile, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }
  return context;
}
