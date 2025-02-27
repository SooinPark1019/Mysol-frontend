"use client";

import Link from "next/link";
import { useUser } from "../context/userContext";

export default function Header() {
  
  return (
    <header className="fixed top-0 left-0 w-full p-5 flex justify-between items-center bg-gray-800 shadow-md z-50">
      {/* 로고 + 문제 평가하기 + 검색 아이콘을 한 줄에 배치 */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-white">
          <Link href="/main">EditorialHub</Link>
        </h1>
        <Link href="/rate-problems" className="text-white hover:underline pl-12">
          문제 평가하기
        </Link>
        <Link href="/search">
          <span role="img" aria-label="search" className="text-white text-2xl pl-4">
            🔍
          </span>
        </Link>
      </div>
    </header>
  );
}
