"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserProvider } from "../context/userContext";
import AutoLogout from "../components/AutoLogout/AutoLogout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-white">
        <UserProvider>
          <AutoLogout />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
