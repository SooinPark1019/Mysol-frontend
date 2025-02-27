"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
            // ✅ `detail`이 문자열이면 그대로 출력
            setError(parsedError.detail);
          } else if (Array.isArray(parsedError.detail)) {
            // ✅ 특정 메시지를 변환하여 출력
            setError(
              parsedError.detail
                .map((e: { msg?: string }) => {
                  if (e.msg === "value is not a valid email address: An email address must have an @-sign.") {
                    return "올바르지 않은 이메일 형식입니다."; // ✅ 특정 메시지 변환
                  }
                  return e.msg || "알 수 없는 오류";
                })
                .join("\n")
            );
          }
            else if (typeof parsedError.detail === "object" && parsedError.detail?.msg) {
              // ✅ `detail`이 객체이고 `msg`가 존재하면 출력
              setError(parsedError.detail.msg);
          } else {
            setError("서버에서 알 수 없는 오류가 반환되었습니다.");
          }
        } catch {
          setError(err.message); // ✅ JSON 파싱 실패 시 기본 메시지 출력
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
        onKeyDown={handleKeyPress} // ✅ Enter 키 입력 지원
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyPress} // ✅ Enter 키 입력 지원
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        로그인
      </button>
    </div>
  );
}
