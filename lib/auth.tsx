"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "moderator";
  permissions: string[];
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  can: (perm: string) => boolean;
};

const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from stored token.
  useEffect(() => {
    if (!localStorage.getItem("token")) return setLoading(false);
    api<User>("/auth/me")
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api<{ token: string; user: User }>(
      "/auth/login",
      { method: "POST", body: { email, password }, auth: false }
    );
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const can = (perm: string) =>
    user?.role === "admin" || !!user?.permissions.includes(perm);

  return (
    <Ctx.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </Ctx.Provider>
  );
}
