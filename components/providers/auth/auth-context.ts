import { User } from "lucia";
import { createContext, useContext } from "react";

type AuthContextType = {
  user: User | null;
  isAuth: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
});

export const useAuth = () => useContext(AuthContext);
