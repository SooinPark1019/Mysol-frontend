"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchPostsInCategory, fetchPostFromBlog, deletePost, fetchCategories, fetchmyBlog } from "@/lib/api";
import type { Post, Category, Blog } from "@/types/blog";
import { formatDistanceToNow } from "date-fns";

export default function PostManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const limit = 10;

  // 데이터를 새로 불러오는 함수
  const loadPosts = async (pageNum: number, category?: number) => {
    try {
      let postsData;
      if (category === undefined) {
        // 전체 게시글 불러오기
        postsData = await fetchPostFromBlog(blog!.id, pageNum);
      } else {
        // 특정 카테고리 게시글 불러오기
        postsData = await fetchPostsInCategory(blog!.id, category, pageNum);
      }
      // 페이지 1이면 기존 데이터 덮어쓰기, 아니면 추가
      setPosts((prev) => (pageNum === 1 ? postsData.articles : [...prev, ...postsData.articles]));
      if (postsData.articles.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  // 초기 데이터 로드: 내 블로그 정보, 카테고리, 게시글
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 내 블로그 정보 가져오기
        const blogData = await fetchmyBlog();
        setBlog(blogData);
        // 내 블로그의 카테고리 가져오기
        const categoriesData = await fetchCategories(blogData.id);
        setCategories(categoriesData);
        // 전체 게시글 불러오기 (activeCategory === "all")
        await loadPosts(1);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load your posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // activeCategory가 변경될 때, 페이지 1부터 다시 불러옴
  useEffect(() => {
    if (!blog) return;
    setPage(1);
    setHasMore(true);
    if (activeCategory === "all") {
      loadPosts(1);
    } else {
      loadPosts(1, Number(activeCategory));
    }
  }, [activeCategory, blog]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (activeCategory === "all") {
      loadPosts(nextPage);
    } else {
      loadPosts(nextPage, Number(activeCategory));
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete || !blog) return;

    try {
      setIsDeleting(true);
      await deletePost(postToDelete);

      setPosts(posts.filter((post) => post.id !== postToDelete));
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const handleEditPost = (postId: number) => {
    router.push(`/edit-post/${postId}`);
  };

  const handleViewPost = (postId: number) => {
    if (!blog) return;
    router.push(`/blog/${blog.id}/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Posts</h1>
        <div className="flex justify-center">
          <p>Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Button onClick={() => router.push("/create-post")}>Create New Post</Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-lg font-medium mb-2">You haven't created any posts yet</h3>
          <p className="text-muted-foreground mb-4">Start sharing your knowledge with the community</p>
          <Button onClick={() => router.push("/create-post")}>Create Your First Post</Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Posts 탭 */}
            <TabsContent value="all" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    categories={categories}
                    onView={() => handleViewPost(post.id)}
                    onEdit={() => handleEditPost(post.id)}
                    onDelete={() => setPostToDelete(post.id)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* 각 카테고리별 탭 */}
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id.toString()} className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {posts.filter((post) => post.category_id === category.id).length > 0 ? (
                    posts.filter((post) => post.category_id === category.id).map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        categories={categories}
                        onView={() => handleViewPost(post.id)}
                        onEdit={() => handleEditPost(post.id)}
                        onDelete={() => setPostToDelete(post.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p>No posts in this category</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      <AlertDialog open={postToDelete !== null} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface PostCardProps {
  post: Post;
  categories: Category[];
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PostCard({ post, categories, onView, onEdit, onDelete }: PostCardProps) {
  const category = categories.find((c) => c.id === post.category_id);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </CardFooter>
    </Card>
  );
}
