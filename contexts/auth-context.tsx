"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types/blog";
import { getCurrentUser, refreshToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser(retries = 0) {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser(accessToken);
        setUser(userData);
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error);

        if (retries < MAX_RETRIES) {
          setTimeout(() => loadUser(retries + 1), RETRY_DELAY);
          return;
        }

        console.error("Max retries reached. Attempting to refresh token...");

        try {
          const refreshTokenStr = localStorage.getItem("refresh_token");
          if (!refreshTokenStr) throw new Error("No refresh token available.");

          const { access_token, refresh_token } = await refreshToken(refreshTokenStr);
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          const refreshedUser = await getCurrentUser(access_token);
          setUser(refreshedUser);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
