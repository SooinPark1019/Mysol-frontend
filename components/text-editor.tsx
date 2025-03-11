"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { MathJax, MathJaxContext } from "better-react-mathjax"

interface Category {
  id: string
  name: string
}

interface TextEditorProps {
  categories: Category[]
  onSave: (postData: PostData) => void
}

interface PostData {
  title: string
  content: string
  problemNumbers: number[]
  category: string
  allowComments: boolean
  isPrivate: boolean
}

export function TextEditor({ categories, onSave }: TextEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [problemNumbers, setProblemNumbers] = useState("")
  const [category, setCategory] = useState("")
  const [allowComments, setAllowComments] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)

  const handleSave = () => {
    const postData: PostData = {
      title,
      content,
      problemNumbers: problemNumbers
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num)),
      category,
      allowComments,
      isPrivate,
    }
    onSave(postData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title" />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here (TeX supported)"
          rows={10}
        />
      </div>

      <div>
        <Label htmlFor="preview">Preview</Label>
        <Card className="p-4">
          <MathJaxContext>
            <MathJax>{content}</MathJax>
          </MathJaxContext>
        </Card>
      </div>

      <div>
        <Label htmlFor="problemNumbers">Problem Numbers</Label>
        <Input
          id="problemNumbers"
          value={problemNumbers}
          onChange={(e) => setProblemNumbers(e.target.value)}
          placeholder="Enter problem numbers, separated by commas"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="allowComments" checked={allowComments} onCheckedChange={setAllowComments} />
        <Label htmlFor="allowComments">Allow Comments</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isPrivate" checked={isPrivate} onCheckedChange={setIsPrivate} />
        <Label htmlFor="isPrivate">Private Post</Label>
      </div>

      <Button onClick={handleSave}>Save Post</Button>
    </div>
  )
}

