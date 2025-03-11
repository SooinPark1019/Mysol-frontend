"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function BlogSettingsPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement API call to update blog settings
    // For now, we'll just simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Blog settings updated",
      description: "Your blog settings have been successfully updated.",
    })
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Blog Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="name">Blog Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="description">Blog Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="featuredImage">Featured Image</Label>
          <Input
            id="featuredImage"
            type="file"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Blog Settings"}
        </Button>
      </form>
    </div>
  )
}

