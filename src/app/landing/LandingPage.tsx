"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [showCTA, setShowCTA] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowCTA(true);
      } else {
        setShowCTA(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* 히어로 섹션 */}
      <section className="h-screen flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-5xl font-extrabold mb-4">문제 해결의 새로운 시작</h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          백준 온라인 저지의 문제 해설을 쉽게 찾아보고, 자신만의 풀이를 공유하세요.
        </p>
      </section>

      {/* 기능 소개 섹션 */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
          <div className="p-5 bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">공식 해설</h2>
            <p className="text-gray-300">
              백준 온라인 저지의 공식 해설을 한 곳에서 찾아볼 수 있습니다.
            </p>
          </div>
          <div className="p-5 bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">커뮤니티 솔루션</h2>
            <p className="text-gray-300">
              다른 사용자들이 올린 다양한 풀이 방법을 확인하고, 나만의 풀이를 공유하세요.
            </p>
          </div>
          <div className="p-5 bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">빠른 검색</h2>
            <p className="text-gray-300">
              문제 번호만 입력하면 간편하게 원하는 문제의 해설을 찾아볼 수 있습니다.
            </p>
          </div>
          <div className="p-5 bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">평점 및 리뷰</h2>
            <p className="text-gray-300">
              문제에 대한 사용자들의 평점과 한 줄 리뷰를 확인하여 더 나은 문제를 선택하세요.
            </p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section id="cta" className="py-20 text-center bg-gray-900">
        <h2 className="text-3xl font-bold">지금 시작해보세요</h2>
        <p className="text-gray-300 mt-2">지금 가입하고 문제 해결 능력을 향상시키세요.</p>
        <button 
          onClick={() => router.push("/main")} 
          className="mt-5 inline-block bg-blue-500 px-6 py-3 rounded-full text-white font-semibold hover:bg-blue-600 transition"
        >
          시작하기
        </button>
      </section>

      {/* 스크롤 시 나타나는 CTA 버튼 */}
      {showCTA && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-5 right-5 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition cursor-pointer"
          onClick={() => router.push("/main")}
        >
          시작하기
        </motion.div>
      )}
    </div>
  );
}