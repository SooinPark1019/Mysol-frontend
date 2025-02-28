"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link"; // ✅ 회원가입 페이지 연결을 위해 추가

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ 로그인 요청 함수 (서버의 detail 메시지 우선 출력)
  const handleLogin = async () => {
    setError(""); // 기존 에러 메시지 초기화
    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        try {
          const parsedError = JSON.parse(err.message);

          if (typeof parsedError.detail === "string") {
            setError(parsedError.detail);
          } else if (Array.isArray(parsedError.detail)) {
            setError(
              parsedError.detail
                .map((e: { msg?: string }) => {
                  if (e.msg === "value is not a valid email address: An email address must have an @-sign.") {
                    return "올바르지 않은 이메일 형식입니다.";
                  }
                  return e.msg || "알 수 없는 오류";
                })
                .join("\n")
            );
          } else if (typeof parsedError.detail === "object" && parsedError.detail?.msg) {
            setError(parsedError.detail.msg);
          } else {
            setError("서버에서 알 수 없는 오류가 반환되었습니다.");
          }
        } catch {
          setError(err.message);
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 사용자가 Enter 키를 눌렀을 때 로그인 실행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">로그인</h2>

      {/* ✅ 서버에서 받은 오류 메시지 표시 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="이메일"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyPress}
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        로그인
      </button>

      <p className="text-center text-gray-600 text-sm mt-4">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
