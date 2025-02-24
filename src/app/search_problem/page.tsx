"use client";

import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

export default function SimplifiedProblemSearchPage() {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("ratingDesc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (): void => {
    if (!query) {
      setError("solved.ac 쿼리를 입력해주세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    // 검색 로직 실행
    console.log({
      query,
      sort: sortOption,
    });

    // 검색 완료 후 초기화 (예시)
    setTimeout(() => {
      setIsLoading(false);
      setQuery("");
      setSortOption("ratingDesc");
    }, 1000);
  };

  const sortOptions = [
    { value: "ratingDesc", label: "별점 높은 순" },
    { value: "ratingAsc", label: "별점 낮은 순" },
    { value: "solversDesc", label: "푼 사람 많은 순" },
    { value: "solversAsc", label: "푼 사람 적은 순" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col justify-center items-center p-5">
      <h1 className="text-4xl font-bold mb-6">문제 검색하기</h1>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-6">
        {/* solved.ac 쿼리 입력 */}
        <Input
          type="text"
          placeholder="solved.ac 쿼리를 입력하세요"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />

        {/* 정렬 기준 드롭다운 */}
        <div className="relative w-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg shadow focus:outline-none hover:bg-gray-300 transition"
          >
            {sortOptions.find((option) => option.value === sortOption)?.label || "정렬 기준 선택"}
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === option.value ? "bg-gray-200" : ""
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 검색 버튼 */}
        <Button onClick={handleSearch} className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "검색 중..." : "검색하기"}
        </Button>
      </div>
    </div>
  );
}
