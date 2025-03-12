"use client"

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
  // 타입 단언을 사용하여 params를 우리가 원하는 타입으로 캐스팅
  const { blogId, postId } = params as { blogId: string; postId: string }
  const blogIdNum = Number(blogId)
  const postIdNum = Number(postId)

  if (isNaN(blogIdNum) || isNaN(postIdNum)) {
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
          <PostDetail blogId={blogIdNum} postId={postIdNum} />
        </Suspense>
      </main>
    </div>
  )
}
