import Sidebar from "@/src/components/sidebar";

const BlogManagement = () => {
  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* 추후 콘텐츠 추가 예정 */}
      </main>
    </div>
  );
};

export default BlogManagement;
