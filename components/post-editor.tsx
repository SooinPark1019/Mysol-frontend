"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MarkdownEditor } from "@/components/markdown-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, createPost } from "@/lib/api"
import type { Category } from "@/types/blog"

interface PostEditorProps {
  blogId: string
}

export function PostEditor({ blogId }: PostEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(blogId)
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      }
    }

    loadCategories()
  }, [blogId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your post.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide content for your post.",
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
      setIsSubmitting(true)

      const postData = {
        title,
        content,
        category_id: categoryId,
      }

      const newPost = await createPost(blogId, postData)

      toast({
        title: "Success!",
        description: "Your post has been published.",
      })

      router.push(`/blog/${blogId}/post/${newPost.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const insertLatex = (inline: boolean) => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const latexTemplate = inline ? "$x^2$" : "\n$$\nx^2 + y^2 = z^2\n$$\n"

    const newText = text.substring(0, start) + latexTemplate + text.substring(end)
    setContent(newText)

    setTimeout(() => {
      const newCursorPos = inline ? start + 1 : start + 5
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos + 3)
    }, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 mt-4">
          <Label>Content</Label>
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <TabsList>
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => insertLatex(true)}>
                      Inline LaTeX
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => insertLatex(false)}>
                      Block LaTeX
                    </Button>
                  </div>
                </div>
                <TabsContent value="write" className="p-0 m-0">
                  <MarkdownEditor ref={editorRef} value={content} onChange={setContent} />
                </TabsContent>
                <TabsContent value="preview" className="p-0 m-0">
                  <MarkdownPreview content={content} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  )
}

