"use client"  // 이 줄을 반드시 최상단에 추가

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
  // params를 단언하여 우리가 원하는 타입으로 사용
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
