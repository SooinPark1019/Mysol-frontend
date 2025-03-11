"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, createCategory } from "@/lib/api"
import type { Category } from "@/types/post"

interface CategorySelectorProps {
  selectedCategories: Category[]
  onChange: (categories: Category[]) => void
}

export function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryOpen, setNewCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [creatingCategory, setCreatingCategory] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await fetchCategories("1")
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
        // Don't show toast here, as it might be annoying if the API is down
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [toast])

  const handleSelect = (category: Category) => {
    const isSelected = selectedCategories.some((c) => c.id === category.id)

    if (isSelected) {
      onChange(selectedCategories.filter((c) => c.id !== category.id))
    } else {
      onChange([...selectedCategories, category])
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    try {
      setCreatingCategory(true)
      const newCategory = await createCategory("1", { name: newCategoryName.trim() })
      setCategories((prev) => [...prev, newCategory])
      onChange([...selectedCategories, newCategory])
      setNewCategoryName("")
      setNewCategoryOpen(false)
      toast({
        title: "Success",
        description: `Category "${newCategory.name}" created successfully.`,
      })
    } catch (error) {
      console.error("Failed to create category:", error)
      toast({
        title: "Notice",
        description: "Using demo mode for category creation.",
        variant: "default",
      })
      // Try to continue with mock data
      try {
        const mockCategory = { id: String(Date.now()), name: newCategoryName.trim() }
        setCategories((prev) => [...prev, mockCategory])
        onChange([...selectedCategories, mockCategory])
        setNewCategoryName("")
        setNewCategoryOpen(false)
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to create category. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setCreatingCategory(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
            {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Select categories"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" side="bottom">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">No categories found.</div>
              </CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <div className="py-6 text-center text-sm">Loading categories...</div>
                ) : (
                  categories.map((category) => (
                    <CommandItem key={category.id} value={category.name} onSelect={() => handleSelect(category)}>
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedCategories.some((c) => c.id === category.id) ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {category.name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setNewCategoryOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new category
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1"
            >
              {category.name}
              <button
                type="button"
                onClick={() => handleSelect(category)}
                className="text-secondary-foreground/70 hover:text-secondary-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="new-category"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewCategoryOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateCategory} disabled={creatingCategory}>
              {creatingCategory ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

