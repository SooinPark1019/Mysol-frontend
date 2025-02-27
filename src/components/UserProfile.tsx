"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function UserProfile() {
  const { username, logout } = useAuth();
  const [error, setError] = useState("");

  // ✅ 로그아웃 요청 처리 (서버 에러 메시지 우선)
  const handleLogout = async () => {
    setError(""); // 기존 에러 초기화
    try {
      await logout();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // 서버 에러 메시지 출력
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-16 h-16 bg-gray-300 rounded-full" />
        <h3 className="text-lg font-bold">{username}</h3>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>

      <nav className="flex justify-center items-center space-x-3 mt-6 w-full">
        <Link href="/write">
          <button className="">글쓰기</button>
        </Link>
        <div className="w-px bg-gray-300 h-8"></div>
        <Link href="/my-blog">
          <button className="">블로그</button>
        </Link>
        <div className="w-px bg-gray-300 h-8"></div>
        <Link href="/manage">
          <button className="">관리</button>
        </Link>
      </nav>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
