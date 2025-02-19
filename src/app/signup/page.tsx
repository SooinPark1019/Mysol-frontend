"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signing up with", email, password);
    // TODO: 회원가입 처리 로직 추가
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center p-5">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-300 text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-full text-white font-semibold mt-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-300 mt-4">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
