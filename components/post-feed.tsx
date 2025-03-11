"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { fetchPosts } from "@/lib/api"
import type { Post } from "@/types/blog"

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

  const limit = 10
  const search = ""
  const categoryId = ""
  const sortBy = "created_at"
  const order = "desc"

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchPosts({
          skip: (page - 1) * limit,
          limit,
          search,
          category_id: categoryId,
          sort_by: sortBy,
          order,
        })
        if (data.length === 0) {
          setHasMore(false)
        } else {
          setPosts((prev) => (prev && page !== 1 ? [...prev, ...data] : data))
        }
      } catch (error) {
        console.error("Failed to load posts:", error)
        setError("Failed to load posts. Using sample data.")
        toast({
          title: "Notice",
          description: "Using sample data while we connect to the server.",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [blogId, page, search, categoryId, sortBy, order, toast, router])

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
        <p className="text-muted-foreground mt-2">
          {error ? "Using sample data. " : ""}
          Be the first to create a post in this blog!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Notice</p>
          <p>{error}</p>
        </div>
      )}
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

