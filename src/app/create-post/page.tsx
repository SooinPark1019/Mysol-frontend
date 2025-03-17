"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MarkdownEditor } from "@/components/markdown-editor"
import { fetchCategories, createPost, fetchmyBlog } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Category, Blog } from "@/types/blog"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [mainImageUrl, setMainImageUrl] = useState("")
  const [problemNumbers, setProblemNumbers] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [allowComments, setAllowComments] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [blog, setBlog] = useState<Blog | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const loadBlogAndCategories = async () => {
      try {
        const blogData = await fetchmyBlog()
        setBlog(blogData)

        const categoriesData = await fetchCategories(blogData.id)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to load blog or categories:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadBlogAndCategories()
    }
  }, [user, authLoading, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !description.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!categoryId) {
      toast({
        title: "Missing category",
        description: "Please select a category for your post.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const formattedProblemNumbers = problemNumbers
        .split(",")
        .map((num) => num.trim())
        .filter((num) => num.length > 0)
        .map(Number)
        .filter((num) => !isNaN(num))

      const postData = {
        title,
        content,
        description,
        main_image_url: mainImageUrl || undefined,
        category_id: categoryId,
        secret: (isPrivate ? 1 : 0) as 0 | 1,
        protected: 0 as 0 | 1,
        password: undefined,
        images: [],
        comments_enabled: (allowComments ? 1 : 0) as 0 | 1,
        problem_numbers: formattedProblemNumbers,
      }

      const newPost = await createPost(postData)
      toast({
        title: "Success!",
        description: "Your post has been published.",
      })
      router.push(`/blog/${blog?.id}/post/${newPost.id}`)
    } catch (error) {
      console.error("Failed to publish post:", error)
      toast({
        title: "Error",
        description: "Failed to publish your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 md:py-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Create Post</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input
              id="problemNumbers"
              placeholder="Problem Numbers (comma separated)"
              value={problemNumbers}
              onChange={(e) => setProblemNumbers(e.target.value)}
            />

            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <MarkdownEditor value={content} onChange={setContent} />

            <div className="flex items-center space-x-2">
              <Switch id="allowComments" checked={allowComments} onCheckedChange={setAllowComments} />
              <Label htmlFor="allowComments">Allow Comments</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isPrivate" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="isPrivate">Private Post</Label>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
