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

  // 기본 키워드 설정 (초기 로드 시 keyword가 없으면 'boj'로 설정)
  useEffect(() => {
    if (!searchParams.get("keyword")) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("keyword", "boj") // 기본 키워드를 'boj'로 설정
      router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router])

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
            searching_words: keywordParam || "boj", // 기본 키워드 적용
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
        setPosts([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [blogId, page, mode, keywordParam, problemParam, sortBy])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (loading && !posts) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <PostCard key={index} post={undefined} />
        ))}
      </div>
    )
  }

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
