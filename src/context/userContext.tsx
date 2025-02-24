"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// 타입 정의
interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  loading: boolean;
}

// Context 생성
const UserContext = createContext<UserContextType | undefined>(undefined);
 
// Provider 컴포넌트 생성
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

// 커스텀 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
