"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Eye, Heart, MessageSquare, Share2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { MarkdownPreview } from "@/components/markdown-preview"
import { useToast } from "@/hooks/use-toast"
import { fetchPost, likePost } from "@/lib/api"
import type { Post } from "@/types/post"

interface PostViewProps {
  id: string
}

export function PostView({ id }: PostViewProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        const data = await fetchPost(id)
        setPost(data)
        // Check if user has liked this post (would come from API in real app)
        setLiked(false)
      } catch (error) {
        console.error("Failed to load post:", error)
        toast({
          title: "Notice",
          description: "Using demo data while we connect to the server.",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id, toast])

  const handleLike = async () => {
    if (!post) return

    try {
      await likePost(post.id)
      setLiked(!liked)
      setPost((prev) => {
        if (!prev) return null
        return {
          ...prev,
          likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1,
        }
      })
    } catch (error) {
      console.error("Failed to like post:", error)
      // Still update the UI optimistically
      setLiked(!liked)
      setPost((prev) => {
        if (!prev) return null
        return {
          ...prev,
          likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1,
        }
      })
      toast({
        title: "Notice",
        description: "Using demo mode for likes.",
        variant: "default",
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

  if (loading || !post) {
    return <Skeleton className="w-full h-96" />
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Post</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>

          {post.problem_number && <div className="mt-2 text-muted-foreground">Problem #{post.problem_number}</div>}

          <div className="flex flex-wrap gap-2 mt-4">
            {post.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar_url} alt={post.author.username} />
                <AvatarFallback>{post.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.username}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleLike}>
                <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                <span className="ml-1">{post.likes_count}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
                <span className="ml-1">{post.comments_count}</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/edit/${post.id}`}>
                  <Edit className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-b py-6">
          <MarkdownPreview content={post.content} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-5 w-5" />
            <span>{post.views_count} views</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLike}>
              {liked ? "Unlike" : "Like"}
            </Button>
            <Button>Comment</Button>
          </div>
        </div>
      </div>
    </article>
  )
}

