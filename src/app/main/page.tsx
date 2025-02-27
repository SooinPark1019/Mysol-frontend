"use client";

import { useState } from "react";
import Link from "next/link";

export default function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 로그인 후 유저네임 저장
  const [error, setError] = useState(""); // 로그인 실패 시 에러 메시지

  const handleLogin = async () => {
    setError(""); // 기존 에러 초기화

    try {
      const response = await fetch("https://api.editorialhub.site/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // API 응답에 message가 있으면 해당 메시지를 출력
        throw new Error(data.detail || "로그인 실패! 이메일 또는 비밀번호를 확인해주세요.");
      }

      // JWT 토큰을 localStorage에 저장
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // 상태 업데이트
      setUsername(data.username);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* 메인 컨텐츠 */}
      <main className="flex flex-1 p-8 space-x-6 max-w-7xl border-t border-gray-300 mt-10">
        {/* 메인 콘텐츠 영역 */}
        <section className="flex-[1.5] p-6">
          <h2 className="text-xl font-bold mb-4">🔥 인기 글</h2>
          <p>여기에 인기 블로그 글 목록이 들어갑니다.</p>
        </section>

        {/* 구분선 */}
        <div className="w-px bg-gray-300 ml-6"></div>

        {/* 오른쪽 사이드바 */}
        <aside className="w-80 flex flex-col justify-between min-h-[500px] space-y-6">
          {/* 로그인 상태에 따라 다른 UI 표시 */}
          <div className="flex-1 p-6 border-b border-gray-300">
            {isLoggedIn ? (
              /* 로그인된 상태: 블로그 정보, 구독자 수, 탭 메뉴 등 */
              <div className="flex flex-col items-center mt-5">
                {/* 프로필 영역 */}
                <div className="flex flex-col items-center space-y-2">
                  {/* 프로필 이미지(임시) */}
                  <div className="w-16 h-16 bg-gray-300 rounded-full" />
                  <h3 className="text-lg font-bold">{username} 님의 블로그</h3>
                  <p className="text-sm text-gray-500">구독자 0명</p>
                </div>

                {/* 탭 메뉴 */}
                <nav className="flex justify-center items-center space-x-3 mt-6 w-full">
                  <Link href="/write">
                    <button className="">글쓰기</button>
                  </Link>

                  {/* 구분선 */}
                  <div className="w-px bg-gray-300 h-8"></div>

                  <Link href="/my-blog">
                    <button className="">블로그</button>
                  </Link>

                  {/* 구분선 */}
                  <div className="w-px bg-gray-300 h-8"></div>

                  <Link href="/manage">
                    <button className="">관리</button>
                  </Link>
                </nav>
              </div>
            ) : (
              /* 로그인되지 않은 상태: 로그인 폼 */
              <div className="space-y-4">
                <h2 className="text-xl font-bold">로그인</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={handleLogin}
                  className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  로그인
                </button>
                <div className="text-sm text-gray-500">
                  계정이 없으신가요?{" "}
                  <Link href="/signup" className="text-blue-600 hover:underline">
                    회원가입
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 평점이 높은 문제 */}
          <div className="flex-1 p-6">
            <h2 className="text-xl font-bold mb-4">⭐ 평점이 높은 문제</h2>
            <p>유저들이 추천하는 문제 목록을 보여줍니다.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
