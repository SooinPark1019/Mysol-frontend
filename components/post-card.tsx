import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Eye, Heart, MessageSquare } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Post } from "@/types/blog"

interface PostCardProps {
  post: Post | undefined
}

export function PostCard({ post }: PostCardProps) {
  if (!post) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-0">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/blog/${post.blog_id}/post/${post.id}`}>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">{post.title}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="line-clamp-3 text-sm text-muted-foreground">{post.content.substring(0, 150) + "..."}</div>
          {post.category_id && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{post.category_id}</Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={post.author_id} />
              <AvatarFallback>{post.author_id.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{post.author_id}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Eye className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>0</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

