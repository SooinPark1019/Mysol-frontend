import { Navbar } from "@/components/navbar"
import { PostEditor } from "@/components/post-editor"

export default function CreatePostPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
            <p className="text-muted-foreground mt-2">Share your problem-solving approach with the community</p>
          </div>
          <PostEditor />
        </div>
      </main>
    </div>
  )
}

