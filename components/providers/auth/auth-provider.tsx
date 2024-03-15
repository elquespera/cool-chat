"use client";
import { User } from "lucia";
import { AuthContext } from "./auth-context";
import { PropsWithChildren } from "react";

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
