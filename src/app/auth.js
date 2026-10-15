"use client";
import { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { getCurrentUser, getUserProfile } from "@/features/auth/services/authGET";
import { login } from "@/features/auth/services/authPOST";
import { logout } from "@/features/auth/services/authLogoutPOST";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recarrega só o perfil (usado após o PUT)
  const refreshProfile = useCallback(async () => {
    const [currentUser, userProfile] = await Promise.all([
      getCurrentUser(),
      getUserProfile(),
    ]);
    setUser(currentUser);
    setProfile(userProfile);
  }, []);

  // Carga inicial: se falhar (não logado), limpa e encerra o loading
  const loadUser = useCallback(async () => {
    try {
      await refreshProfile();
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const signIn = useCallback(
    async (username, senha) => {
      await login(username, senha);
      await refreshProfile();
    },
    [refreshProfile]
  );

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signOut,
      refreshProfile,
      isAuthenticated: !!user,
    }),
    [user, profile, loading, signIn, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}