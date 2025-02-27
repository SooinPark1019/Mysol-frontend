"use client";

import { createContext, useState, useEffect, useContext, useCallback } from "react";

// ✅ 기본 API URL 설정
const BASE_API_URL = "https://api.editorialhub.site";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // ✅ 로그아웃 함수 (useCallback으로 관리)
  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "로그아웃 실패!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsername("");
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ 자동으로 토큰을 갱신하는 fetch 함수 (서버 에러 메시지 처리)
  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const response = await fetch(`${BASE_API_URL}${url}`, {
        ...options,
        credentials: "include", // ✅ 쿠키 포함 요청
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 🔄 Access Token이 만료된 경우, 자동으로 refresh 시도
          const refreshResponse = await fetch(`${BASE_API_URL}/api/users/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (!refreshResponse.ok) {
            const errorData = await refreshResponse.json();
            console.error(errorData.detail || "Refresh Token 만료됨. 자동 로그아웃 실행.");
            logout(); // ✅ Refresh Token도 만료되었다면 자동 로그아웃
            throw new Error(errorData.detail || "세션이 만료되었습니다. 다시 로그인하세요.");
          }

          // ✅ 새 Access Token이 발급되었으므로 원래 요청을 다시 실행
          return fetch(`${BASE_API_URL}${url}`, {
            ...options,
            credentials: "include",
          });
        }

        // ❌ 일반적인 에러 처리 (서버의 detail 메시지를 우선 반환)
        const errorData = await response.json();
        throw new Error(errorData.detail || "요청 처리 중 오류가 발생했습니다.");
      }

      return response;
    },
    [logout] // ✅ 의존성으로 logout을 설정하여 최신 로그아웃 함수 사용
  );

  // ✅ 새로고침 후 로그인 상태 유지
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const refreshResponse = await fetch(`${BASE_API_URL}/api/users/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshResponse.ok) {
          const errorData = await refreshResponse.json();
          console.error(errorData.detail || "Refresh Token 만료됨. 자동 로그아웃 실행.");
          logout(); // ✅ Refresh Token 만료 시 자동 로그아웃
          return;
        }

        const response = await fetchWithAuth("/api/users/me", {
          method: "GET",
        });

        if (!response.ok) throw new Error("자동 로그인 실패");

        const data = await response.json();
        setUsername(data.username);
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err);
        logout();
      }
    };

    checkAuthStatus();
  }, [logout, fetchWithAuth]);

  // ✅ 로그인 요청 (서버 에러 메시지 처리)
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ 쿠키 포함 요청
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "로그인 실패!");

      // ✅ 로그인 성공 후, 사용자 정보 가져오기
      const profileResponse = await fetchWithAuth("/api/users/me", {
        method: "GET",
      });

      if (!profileResponse.ok) throw new Error("사용자 정보 가져오기 실패");

      const profileData = await profileResponse.json();
      setUsername(profileData.username);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 커스텀 훅 (다른 컴포넌트에서 쉽게 사용 가능)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다.");
  return context;
};
