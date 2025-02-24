"use client";

import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

export default function MainSearchPage() {
  const [searchOption, setSearchOption] = useState("problemNumber");
  const [problemNumber, setProblemNumber] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (): void => {
    if (
      (searchOption === "problemNumber" && !problemNumber) ||
      (searchOption === "keyword" && !keyword)
    ) {
      setError("검색어를 입력해주세요.");
      return;
    }
    setError("");
    setIsLoading(true);

    // 검색 로직 실행
    console.log({
      type: searchOption,
      value: searchOption === "problemNumber" ? problemNumber : keyword,
    });

    // 검색 완료 후 초기화
    setTimeout(() => {
      setIsLoading(false);
      setProblemNumber("");
      setKeyword("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col justify-center items-center p-5">
      <h1 className="text-4xl font-bold mb-6">풀이 검색하기</h1>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-6">
        {/* 검색 옵션 선택 */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="problemNumber"
              checked={searchOption === "problemNumber"}
              onChange={() => setSearchOption("problemNumber")}
              className="mr-2"
            />
            문제 번호로 검색
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="keyword"
              checked={searchOption === "keyword"}
              onChange={() => setSearchOption("keyword")}
              className="mr-2"
            />
            키워드로 검색
          </label>
        </div>

        {/* 선택된 옵션에 따른 입력창 */}
        {searchOption === "problemNumber" ? (
          <Input
            type="number"
            placeholder="문제 번호 입력"
            value={problemNumber}
            min={1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProblemNumber(e.target.value)}
          />
        ) : (
          <Input
            type="text"
            placeholder="키워드 입력"
            value={keyword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
          />
        )}

        {/* 에러 메시지 표시 */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 검색 버튼 */}
        <Button
          onClick={handleSearch}
          className="w-full mt-4"
          disabled={isLoading || (searchOption === "problemNumber" && !problemNumber) || (searchOption === "keyword" && !keyword)}
        >
          {isLoading ? "검색 중..." : "검색하기"}
        </Button>
      </div>
    </div>
  );
}
