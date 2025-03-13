"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import "highlight.js/styles/github-dark.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write");
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true); // 추가
  }, []);

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

  const handleInsertCodeBlock = (language: string) => {
    const codeTemplate = `\`\`\`${language}\n// Your code here\n\`\`\`\n`

    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    if (start !== end) {
      const selectedText = text.substring(start, end)
      const wrappedCode = `\`\`\`${language}\n${selectedText}\n\`\`\`\n`
      const newText = text.substring(0, start) + wrappedCode + text.substring(end)
      onChange(newText)

      setTimeout(() => {
        textarea.focus()
        const newPosition = start + wrappedCode.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    } else {
      const newText = text.substring(0, start) + codeTemplate + text.substring(end)
      onChange(newText)

      setTimeout(() => {
        textarea.focus()
        const cursorPosition = start + codeTemplate.indexOf("// Your code here")
        textarea.setSelectionRange(cursorPosition, cursorPosition + "// Your code here".length)
      }, 0)
    }
  }

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" title="Code Block">
                  Code
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleInsertCodeBlock("javascript")}>JavaScript</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInsertCodeBlock("python")}>Python</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInsertCodeBlock("cpp")}>C++</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
