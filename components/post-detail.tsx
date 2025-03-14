"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Eye, Heart, MessageSquare, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { fetchPost, likePost, unlikePost, getLike } from "@/lib/api"
import { MarkdownPreview } from "@/components/markdown-preview"
import type { Post } from "@/types/blog"

interface PostDetailProps {
  blogId: number
  postId: number
}

export function PostDetail({ blogId, postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [needsPassword, setNeedsPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const loadPost = async (pwd?: string) => {
    try {
      setLoading(true)
      setError(null)
      // pwd가 있으면 전달, 없으면 undefined
      const data = await fetchPost(postId)
      setPost(data)
      setNeedsPassword(false)
      // 좋아요 여부 확인: getLike가 boolean을 반환한다고 가정
      const likeStatus = await getLike(data.id)
      setLiked(likeStatus)
    } catch (err: any) {
      console.error("Failed to load post:", err)
      if (err?.message && err.message.includes("NoAuthoriztion")) {
        setNeedsPassword(true)
        setError("This post is protected. Please enter the password.")
      } else {
        setError("Failed to load post. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPost()
  }, [postId, toast])

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await loadPost(password)
  }

  const handleLike = async () => {
    if (!post) return

    try {
      if (liked) {
        await unlikePost(post.id)
      } else {
        await likePost({ article_id: post.id })
      }
      setLiked(!liked)
      setPost((prev) => {
        if (!prev) return null
        return {
          ...prev,
          article_likes: liked ? (prev.article_likes || 1) - 1 : (prev.article_likes || 0) + 1,
        }
      })
    } catch (error) {
      console.error("Failed to like/unlike post:", error)
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    })
  }

  if (loading) {
    return <Skeleton className="w-full h-96" />
  }

  if (needsPassword) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">This post is protected</h3>
        {error && <p className="text-muted-foreground mt-2">{error}</p>}
        <form onSubmit={handlePasswordSubmit} className="mt-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <Button type="submit" className="ml-2">
            Submit
          </Button>
        </form>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">Post not found</h3>
        <p className="text-muted-foreground mt-2">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">{post.title}</h1>

          {post.problem_numbers && post.problem_numbers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.problem_numbers.map((num) => (
                <Badge key={num} variant="outline">
                  Problem #{num}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={post.blog_name} />
                <AvatarFallback>{post.blog_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.blog_name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                <span className="ml-1">{post.article_likes || 0}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-5 w-5" />
                <span className="ml-1">{post.article_comments || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-b py-8">
          <MarkdownPreview content={post.content || ""} />
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-5 w-5" />
            <span>{post.views || 0} views</span>
          </div>

          <Button variant={liked ? "default" : "outline"} onClick={handleLike}>
            {liked ? "Liked" : "Like"}
          </Button>
        </div>
      </div>
    </article>
  )
}
