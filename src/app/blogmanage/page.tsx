"use client";
import { useState } from "react";
import Sidebar from "@/src/components/sidebar";
import axios from "axios";
import Image from "next/image";

const API_BASE_URL = "https://api.editorialhub.site";

const BlogManagement = () => {
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

  // 블로그 정보 저장 핸들러
  const handleSave = async () => {
    let imageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        // FastAPI 업로드 API 호출
        const uploadResponse = await axios.post(`${API_BASE_URL}/api/images/upload/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadResponse.data.url; // 업로드된 이미지 URL 저장
      } catch (error: unknown) {
        console.error("이미지 업로드 실패:", error);
        let errorMessage = "이미지 업로드에 실패했습니다.";

        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        alert(errorMessage);
        return;
      }
    }

    try {
      // 블로그 정보 업데이트 API 호출
      await axios.patch(`${API_BASE_URL}/api/blogs/update/`, {
        blog_name: blogName,
        main_image_URL: imageUrl,
      });
      alert("블로그 정보가 성공적으로 업데이트되었습니다!");
    } catch (error: unknown) {
      console.error("블로그 정보 업데이트 실패:", error);
      let errorMessage = "블로그 정보 업데이트에 실패했습니다.";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 p-10 bg-gray-100 flex flex-col items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center">블로그 관리</h1>

          {/* 대표 이미지 수정 */}
          <label className="block text-xl font-medium mb-3">대표 이미지 수정</label>

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
          <label className="block text-xl font-medium mb-3">블로그 이름 수정</label>
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
