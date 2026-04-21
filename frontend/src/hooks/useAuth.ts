import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

/** Auth hook — manages token in localStorage */
export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem("auth_user");
    return u ? JSON.parse(u) : null;
  });

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return { token, user, isAuthenticated, login, logout };
}
