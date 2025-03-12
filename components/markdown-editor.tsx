"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertMarkdown = (markdownTemplate: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + markdownTemplate + text.substring(end);
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + markdownTemplate.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border rounded-md">
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => handleInsertMarkdown("**bold text**")}>
              Bold
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleInsertMarkdown("*italic text*")}>
              Italic
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleInsertMarkdown("```\nconsole.log('Hello, world!');\n```")
              }
            >
              Code
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleInsertMarkdown("$E = mc^2$")}>
              Math
            </Button>
          </div>
        </div>
        <TabsContent value="write" className="p-0 m-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[400px] p-4 font-mono text-sm resize-y focus:outline-none"
            placeholder="Write your post content here using Markdown syntax..."
          />
        </TabsContent>
        <TabsContent value="preview" className="p-0 m-0">
          <div className="min-h-[400px] p-4 prose prose-sm max-w-none dark:prose-invert overflow-auto">
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Preview will appear here...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
