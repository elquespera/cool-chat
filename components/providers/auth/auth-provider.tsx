"use client";
import { User } from "lucia";
import { PropsWithChildren } from "react";
import { AuthContext } from "./auth-context";

type AuthProviderProps = {
  user: User | null;
} & PropsWithChildren;

export function AuthProvider({ user, children }: AuthProviderProps) {
  const isAuth = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
