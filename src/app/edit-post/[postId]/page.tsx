"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MarkdownEditor } from "@/components/markdown-editor"
import { fetchCategories, fetchPost, updatePost, fetchmyBlog } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Category, Blog, Post } from "@/types/blog"

interface EditPostPageProps {
  params: {
    postId: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const postId = Number.parseInt(params.postId)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [problemNumbers, setProblemNumbers] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [allowComments, setAllowComments] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [post, setPost] = useState<Post | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to edit a post.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const loadData = async () => {
      try {
        setIsLoading(true)

        // Fetch blog info
        const blogData = await fetchmyBlog()
        setBlog(blogData)

        // Fetch post data
        const postData = await fetchPost(postId)
        setPost(postData)

        // Set form values
        setTitle(postData.title)
        setContent(postData.content)
        setDescription(postData.description || "")
        setCategoryId(postData.category_id.toString())
        setAllowComments(postData.comments_enabled === 1)
        setIsPrivate(postData.secret === 1)

        // Set problem numbers
        if (postData.problem_numbers && postData.problem_numbers.length > 0) {
          setProblemNumbers(postData.problem_numbers.join(", "))
        }

        // Fetch categories
        const categoriesData = await fetchCategories(blogData.id)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load post data. Please try again.",
          variant: "destructive",
        })
        router.push("/blog/posts")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [postId, user, authLoading, router, toast])

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
      setIsSaving(true)

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
        category_id: Number(categoryId),
        secret: (isPrivate ? 1 : 0) as 0 | 1,
        protected: 0 as 0 | 1,
        comments_enabled: (allowComments ? 1 : 0) as 0 | 1,
        problem_numbers: formattedProblemNumbers,
      }

      await updatePost(postId, postData)

      toast({
        title: "Success!",
        description: "Your post has been updated.",
      })

      router.push("/blog/posts")
    } catch (error) {
      console.error("Failed to update post:", error)
      toast({
        title: "Error",
        description: "Failed to update your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-6 md:py-12">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p>Loading post data...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 md:py-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="problemNumbers">Problem Numbers (comma separated)</Label>
                <Input
                  id="problemNumbers"
                  placeholder="e.g. 1234, 5678"
                  value={problemNumbers}
                  onChange={(e) => setProblemNumbers(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
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
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <MarkdownEditor value={content} onChange={setContent} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="allowComments" checked={allowComments} onCheckedChange={setAllowComments} />
                <Label htmlFor="allowComments">Allow Comments</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isPrivate" checked={isPrivate} onCheckedChange={setIsPrivate} />
                <Label htmlFor="isPrivate">Private Post</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/blog/posts")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

