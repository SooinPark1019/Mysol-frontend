"use client";

import { useAuth } from "@/src/context/AuthContext";
import LoginForm from "@/src/components/LoginForm";
import UserProfile from "@/src/components/UserProfile";

export default function MainPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <main className="flex flex-1 p-8 space-x-6 border-t border-gray-300 mt-10">
        {/* 글 목록 섹션 (2 비율) */}
        <section className="flex-[5] p-6">
          <h2 className="text-xl font-bold mb-4">🔥 인기 글</h2>
          <p>여기에 인기 블로그 글 목록이 들어갑니다.</p>
        </section>

        <div className="w-px bg-gray-300"></div>

        {/* 프로필/로그인 섹션 (1 비율) */}
        <aside className="flex-[2] flex flex-col justify-between min-h-[500px] space-y-6">
          <div className="flex-1 p-6 border-b border-gray-300">
            {isLoggedIn ? <UserProfile /> : <LoginForm />}
          </div>
        </aside>
      </main>
    </div>
  );
}
