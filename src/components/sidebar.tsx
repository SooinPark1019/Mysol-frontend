"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileText, Folder, MessageCircle } from "lucide-react";
import Card from "./ui/card";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "블로그 관리", icon: <FileText size={20} />, path: "/blogmanage" },
    { name: "글 관리", icon: <FileText size={20} />, path: "/articlemanage" },
    { name: "카테고리 관리", icon: <Folder size={20} />, path: "/categorymanage" },
    { name: "댓글 관리", icon: <MessageCircle size={20} />, path: "/commentmanage" },
  ];

  return (
    <aside className="w-52 bg-white p-3 shadow-lg h-screen flex flex-col mt-16">
      {/* 블로그 대표 이미지 및 이름 */}
      <Card className="flex flex-col items-center mb-4 p-3 mt-8">
        <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
        <h2 className="text-base font-semibold">블로그 이름</h2>
      </Card>
      
      {/* 메뉴 리스트 */}
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Link href={item.path} key={item.name}>
            <button
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all w-full text-left text-sm text-black ${
                pathname === item.path ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
