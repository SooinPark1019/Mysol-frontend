"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-[400px] p-4 prose prose-sm max-w-none dark:prose-invert">Loading preview...</div>
  }

  return (
    <div className="min-h-[400px] p-4 prose prose-sm max-w-none dark:prose-invert overflow-auto">
      {content ? (
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {content}
        </ReactMarkdown>
      ) : (
        <p className="text-muted-foreground">Preview will appear here...</p>
      )}
    </div>
  )
}

