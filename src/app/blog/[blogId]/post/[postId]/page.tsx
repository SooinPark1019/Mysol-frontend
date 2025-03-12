import { Suspense } from "react"
import { PostDetail } from "@/components/post-detail"
import { PostDetailSkeleton } from "@/components/post-detail-skeleton"

interface PostPageProps {
  params: {
    blogId: string
    postId: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  const blogId = Number(params.blogId)
  const postId = Number(params.postId)

  if (isNaN(blogId) || isNaN(postId)) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-6 md:py-12">
          <h2 className="text-center text-xl font-semibold text-red-500">
            Invalid blog or post ID.
          </h2>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 md:py-12">
        <Suspense fallback={<PostDetailSkeleton />}>
          <PostDetail blogId={blogId} postId={postId} />
        </Suspense>
      </main>
    </div>
  )
}
