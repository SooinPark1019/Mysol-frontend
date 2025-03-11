"use client"

import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(({ value, onChange }, ref) => {
  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your content here using Markdown and LaTeX syntax..."
      className="min-h-[400px] font-mono text-sm p-4 resize-y rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  )
})

MarkdownEditor.displayName = "MarkdownEditor"

