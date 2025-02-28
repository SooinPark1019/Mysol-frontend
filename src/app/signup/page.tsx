"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]); // 에러 메시지를 배열로 관리
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ 에러 처리 함수 (배열에 추가)
  const handleError = (message: string) => {
    setErrors((prevErrors) => [...prevErrors, message]);
    setLoading(false);
  };

  // ✅ 성공 처리 함수
  const handleSuccess = () => {
    setSuccess("회원가입이 성공적으로 완료되었습니다");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors([]); // 에러 초기화

    // 2초 후 로그인 페이지로 이동
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  // ✅ 회원가입 요청 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    // 비밀번호 확인
    if (password !== confirmPassword) {
      handleError("비밀번호가 일치하지 않습니다");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.editorialhub.site/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "회원가입에 실패했습니다");
      }

      handleSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleError(error.message);
      } else {
        handleError("알 수 없는 오류가 발생했습니다");
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center p-5">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mt-20">
        <h2 className="text-3xl font-bold text-gray-300 text-center mb-4">Sign Up</h2>

        {/* ✅ 에러 및 성공 메시지 출력 (모든 메시지 고정 위치에 출력) */}
        {errors.length > 0 && (
          <div className="mb-4 bg-red-500 text-white p-3 rounded">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-500 text-white p-3 rounded text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ✅ 유저네임 입력 */}
          <label className="text-gray-300">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </label>

          {/* ✅ 이메일 입력 */}
          <label className="text-gray-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </label>

          {/* ✅ 비밀번호 입력 */}
          <label className="text-gray-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </label>

          {/* ✅ 비밀번호 확인 입력 */}
          <label className="text-gray-300">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </label>

          {/* ✅ 제출 버튼 + 로딩 스피너 */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-full text-white font-semibold mt-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="loader"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* ✅ 로그인 링크 */}
        <p className="text-center text-gray-300 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link href="/main" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
