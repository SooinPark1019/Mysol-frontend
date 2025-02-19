"use client"; // 클라이언트 컴포넌트

import "./globals.css";  // Tailwind CSS 적용
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-white">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}