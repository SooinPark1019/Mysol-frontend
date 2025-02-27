"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
