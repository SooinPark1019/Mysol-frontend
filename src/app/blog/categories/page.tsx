"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement API call to add a new category
    // For now, we'll just simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
    }
    setCategories([...categories, newCategory])
    setNewCategoryName("")
    toast({
      title: "Category added",
      description: "The new category has been successfully added.",
    })
    setIsLoading(false)
  }

  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true)

    // TODO: Implement API call to delete a category
    // For now, we'll just simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setCategories(categories.filter((category) => category.id !== id))
    toast({
      title: "Category deleted",
      description: "The category has been successfully deleted.",
    })
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <form onSubmit={handleAddCategory} className="space-y-4 max-w-md mb-8">
        <div>
          <Label htmlFor="newCategory">New Category Name</Label>
          <Input
            id="newCategory"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Category"}
        </Button>
      </form>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between">
            <span>{category.name}</span>
            <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)} disabled={isLoading}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

