import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { PostDetail } from "@/components/post-detail"
import { PostDetailSkeleton } from "@/components/post-detail-skeleton"

interface PostPageProps {
  params: {
    blogId: string
    postId: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 md:py-12">
        <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail blogId={Number(params.blogId)} postId={Number(params.postId)} />
        </Suspense>
      </main>
    </div>
  )
}

