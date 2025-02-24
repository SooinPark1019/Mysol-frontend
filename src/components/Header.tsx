"use client";

import Link from "next/link";
import { useUser } from "../context/userContext";

export default function Header() {
  const { username, setUsername } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setUsername(null); // 전역 상태 초기화
  };

  return (
    <header className="fixed top-0 left-0 w-full p-5 flex justify-between items-center bg-gray-800 shadow-md z-50">
      <h1 className="text-2xl font-bold text-white">EditorialHub</h1>
      <nav className="flex items-center space-x-4">
        <Link href="/search_solution" className="text-gray-300 hover:text-white">Search Solution</Link>
        <Link href="/search_problem" className="text-gray-300 hover:text-white">Search Problem</Link>

        {username ? (
          <div className="flex items-center space-x-2 text-gray-300">
            <span>Welcome, {username}!</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-gray-300 hover:text-white">Login</Link>
        )}
      </nav>
    </header>
  );
}
