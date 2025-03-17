"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchmyBlog } from "@/lib/api"
import type { Blog, Category } from "@/types/blog"

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
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
        setLoading(false)
      }
    }

    loadBlogAndCategories()
  }, [toast])

  const handleCreateCategory = async () => {
    if (!blog) return
  
    try {
      const newCategory = await createCategory({ categoryname: categoryName })
      setCategories((prev) => [...prev, newCategory])
      const updatedCategories = await fetchCategories(blog.id)
      setCategories(updatedCategories)
  
      setCategoryName("")
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Category created successfully.",
      })
    } catch (error) {
      console.error("Failed to create category:", error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleUpdateCategory = async () => {
    if (editingCategoryId === null) return
    try {
      await updateCategory(editingCategoryId, { categoryname: categoryName })
      const updatedCategories = await fetchCategories(blog!.id)
      setCategories(updatedCategories)
  
      setCategoryName("")
      setIsDialogOpen(false)
      setIsEditing(false)
      setEditingCategoryId(null)
  
      toast({
        title: "Success",
        description: "Category updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update category:", error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteCategory = async (catId: number) => {
    try {
      await deleteCategory(catId)
      const updatedCategories = await fetchCategories(blog!.id)
      setCategories(updatedCategories)
  
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  if (loading) {
    return <div>Loading categories...</div>
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={() => {
              setIsEditing(false)
              setEditingCategoryId(null)
              setCategoryName("")
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <span>{category.name}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true)
                    setEditingCategoryId(category.id)
                    setCategoryName(category.name)
                    setIsDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={isEditing ? handleUpdateCategory : handleCreateCategory}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
