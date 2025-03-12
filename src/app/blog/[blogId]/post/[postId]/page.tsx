import { Suspense } from "react"
import { PostDetail } from "@/components/post-detail"
import { PostDetailSkeleton } from "@/components/post-detail-skeleton"

// 인라인 타입 사용: params는 { blogId: string, postId: string }로 정의
export default async function PostPage({ params }: { params: { blogId: string, postId: string } }) {
  const blogIdNum = Number(params.blogId)
  const postIdNum = Number(params.postId)

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
