"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fetchmyBlog, updateBlog } from "@/lib/api"; // ✅ 블로그 정보 가져오기 및 업데이트 함수 추가
import type { Blog } from "@/types/blog";

export default function BlogSettingsPage() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blog_name, setblogName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // 🔹 블로그 정보 불러오기
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await fetchmyBlog();
        setBlog(blogData);
        setblogName(blogData.blog_name);
        setDescription(blogData.description);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        toast({
          title: "Error",
          description: "Failed to load blog settings.",
          variant: "destructive",
        });
      }
    };
    loadBlog();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setIsLoading(true);
    try {
      await updateBlog({ blog_name, description });

      toast({
        title: "Blog settings updated",
        description: "Your blog settings have been successfully updated.",
      });

      // ✅ 업데이트 후 페이지 새로고침 (또는 홈으로 이동)
      router.refresh();
    } catch (error) {
      console.error("Failed to update blog settings:", error);
      toast({
        title: "Error",
        description: "Failed to update blog settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Blog Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="name">Blog Name</Label>
          <Input id="name" value={blog_name} onChange={(e) => setblogName(e.target.value)} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="description">Blog Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Blog Settings"}
        </Button>
      </form>
    </div>
  );
}
