"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { fetchPostsByKeywords, fetchPostsByProblemNumber } from "@/lib/api"
import type { Post, PaginatedArticleListResponse } from "@/types/blog"

interface PostFeedProps {
  blogId?: string
}

export function PostFeed({ blogId }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const limit = 10

  // URL query parameters
  const mode = searchParams.get("mode") || "keyword"
  const keywordParam = searchParams.get("keyword") || ""
  const problemParam = searchParams.get("problem_number")
  const sortParam = searchParams.get("sort_by")
  const sortBy: "latest" | "likes" | "views" =
    sortParam === "recent" ? "latest" : ((sortParam as "latest" | "likes" | "views") || "latest")

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        let data: PaginatedArticleListResponse
        if (mode === "problem" && problemParam) {
          const problem_number = parseInt(problemParam)
          data = await fetchPostsByProblemNumber({
            problem_number,
            page,
            per_page: limit,
            sort_by: sortBy,
          })
        } else {
          data = await fetchPostsByKeywords({
            searching_words: keywordParam,
            page,
            per_page: limit,
            sort_by: sortBy,
          })
        }

        if (data.articles.length === 0) {
          setHasMore(false)
        }

        // 새 데이터 누적
        setPosts((prev) =>
          prev && page !== 1 ? [...prev, ...data.articles] : data.articles
        )
      } catch (error) {
        console.error("Failed to load posts:", error)
        // ❌ 에러 메시지나 샘플 데이터 대신 posts를 빈 배열로 설정
        setPosts([])
        setHasMore(false)
        // setError("Failed to load posts") // 필요하면 간단한 에러 state만 유지
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [blogId, page, mode, keywordParam, problemParam, sortBy, toast, router])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  // 로딩 중이면서 아직 posts가 없는 경우 → 스켈레톤 표시
  if (loading && !posts) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <PostCard key={index} post={undefined} />
        ))}
      </div>
    )
  }

  // 포스트가 없는 경우 (에러 or 검색 결과 없음) → "No posts found"
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">No posts found</h3>
        <p className="text-muted-foreground mt-2">Be the first to create a post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 필요하다면 에러 표시 부분도 추가 가능
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Notice</p>
          <p>{error}</p>
        </div>
      )} */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
