"use client";

import { useState } from "react";
import Sidebar from "@/src/components/sidebar";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";

const API_BASE_URL = "https://api.editorialhub.site";

const BlogManagement = () => {
  const { fetchWithAuth } = useAuth();
  const [blogName, setBlogName] = useState(""); // 블로그 이름 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 이미지 미리보기
  const [imageFile, setImageFile] = useState<File | null>(null); // 업로드할 파일

  // 블로그 이름 입력 핸들러
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlogName(event.target.value);
  };

  // 이미지 선택 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // 미리보기 생성
    }
  };

  // 🔹 서버에서 받은 오류 메시지를 우선 반환하는 헬퍼 함수
  const getServerErrorMessage = async (response: Response) => {
    try {
      const errorData = await response.json();
      if (errorData?.detail) return errorData.detail; // FastAPI의 기본 에러 응답 처리
      return JSON.stringify(errorData); // JSON 형태로 응답이 오면 문자열로 변환
    } catch {
      return response.statusText || "알 수 없는 서버 오류가 발생했습니다.";
    }
  };

  // 🔹 오류 메시지를 안전하게 가져오는 헬퍼 함수
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "알 수 없는 오류가 발생했습니다.";
  };

  // 블로그 정보 저장 핸들러 (fetchWithAuth 사용)
  const handleSave = async () => {
    let imageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        // ✅ 이미지 업로드 요청 (fetchWithAuth 사용)
        const uploadResponse = await fetchWithAuth(`${API_BASE_URL}/api/images/upload/`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(await getServerErrorMessage(uploadResponse));
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url; // 업로드된 이미지 URL 저장
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert(getErrorMessage(error)); // 🔹 타입 안전한 오류 메시지 처리
        return;
      }
    }

    try {
      // ✅ 블로그 정보 업데이트 요청 (fetchWithAuth 사용)
      const response = await fetchWithAuth(`${API_BASE_URL}/api/blogs/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog_name: blogName, main_image_URL: imageUrl }),
      });

      if (!response.ok) {
        throw new Error(await getServerErrorMessage(response));
      }

      alert("블로그 정보가 성공적으로 업데이트되었습니다!");
    } catch (error) {
      console.error("블로그 정보 업데이트 실패:", error);
      alert(getErrorMessage(error)); // 🔹 타입 안전한 오류 메시지 처리
    }
  };

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 p-10 bg-gray-100 flex flex-col items-center mt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-black">블로그 관리</h1>

          {/* 대표 이미지 수정 */}
          <label className="block text-xl font-medium mb-3 text-black">대표 이미지 수정</label>

          {/* 이미지 미리보기 */}
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="미리보기"
              width={208}
              height={208}
              className="object-cover rounded-lg mb-5 mx-auto shadow"
            />
          ) : (
            <div className="w-52 h-52 bg-gray-200 rounded-lg flex items-center justify-center mb-5 mx-auto shadow">
              <span className="text-gray-500 text-lg">미리보기 없음</span>
            </div>
          )}

          {/* 파일 업로드 버튼 */}
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-8 block w-full text-lg p-2 border rounded-lg" />

          {/* 블로그 이름 수정 */}
          <label className="block text-xl font-medium mb-3 text-black">블로그 이름 수정</label>
          <input
            type="text"
            value={blogName}
            onChange={handleNameChange}
            className="w-full p-4 border rounded-lg text-lg mb-8 text-black"
            placeholder="수정하고 싶은 블로그 이름 입력"
          />

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg w-full text-lg font-semibold hover:bg-blue-700 transition"
          >
            저장
          </button>
        </div>
      </main>
    </div>
  );
};

export default BlogManagement;
