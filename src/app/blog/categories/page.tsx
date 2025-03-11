"use client"

import { useState, useEffect } from "react";
import { CategoryManager } from "@/components/category-manager"
import { useAuth } from "@/contexts/auth-context"
import { fetchmyBlog } from "@/lib/api"
import type { Blog } from "@/types/blog";

export default function CategoryManagementPage() {
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await fetchmyBlog();
        setBlog(blogData);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Error fetching blog.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadBlog();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to manage categories.</div>
  }

  if (loading) {
    return <div>Loading blog data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      {blog ? (
        <CategoryManager />
      ) : (
        <div>No blog available.</div>
      )}
    </div>
  );
}

