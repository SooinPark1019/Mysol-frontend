"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full p-5 flex justify-between items-center bg-gray-800 shadow-md z-50">
      <h1 className="text-2xl font-bold">EditorialHub</h1>
      <nav>
        <Link href="/" className="text-gray-300 hover:text-white mx-4">Home</Link>
        <Link href="/about" className="text-gray-300 hover:text-white mx-4">About</Link>
        <Link href="/features" className="text-gray-300 hover:text-white mx-4">Features</Link>
        <Link href="/login" className="text-gray-300 hover:text-white mx-4">Login</Link>
      </nav>
    </header>
  );
}