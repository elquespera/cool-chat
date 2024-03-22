"use client";
import { User } from "lucia";
import { PropsWithChildren, useMemo } from "react";
import { AuthContext } from "./auth-context";

type AuthProviderProps = {
  user: User | null;
} & PropsWithChildren;

export function AuthProvider({ user, children }: AuthProviderProps) {
  const value = useMemo(
    () => ({
      user,
      isAuth: !!user,
      isAdmin: user?.role === "admin",
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
