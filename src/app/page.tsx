import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { PostFeed } from "@/components/post-feed"
import { PostFilters } from "@/components/post-filters"
import { PostSkeleton } from "@/components/post-skeleton"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">EditorialHub</h1>
            <p className="text-muted-foreground">Discover and share problem-solving content with the community</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
            <Suspense fallback={<div>Loading filters...</div>}>
              <PostFilters />
            </Suspense>
            <div className="space-y-6">
              <Suspense fallback={<PostSkeletonList />}>
                <PostFeed />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function PostSkeletonList() {
  return (
    <div className="space-y-6">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <PostSkeleton key={i} />
        ))}
    </div>
  )
}

