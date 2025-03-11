"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PostFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchType, setSearchType] = useState<"keyword" | "problem">("keyword")
  const [keyword, setKeyword] = useState("")
  const [problemNumber, setProblemNumber] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    // Initialize filters from URL
    const keywordParam = searchParams.get("keyword")
    const problemParam = searchParams.get("problem_number")
    const sortParam = searchParams.get("sort_by")

    if (keywordParam) {
      setSearchType("keyword")
      setKeyword(keywordParam)
    } else if (problemParam) {
      setSearchType("problem")
      setProblemNumber(problemParam)
    }
    if (sortParam) setSortBy(sortParam)
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchType === "keyword" && keyword) {
      params.set("keyword", keyword)
    } else if (searchType === "problem" && problemNumber) {
      params.set("problem_number", problemNumber)
    }
    params.set("sort_by", sortBy)

    router.push(`?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearchType("keyword")
    setKeyword("")
    setProblemNumber("")
    setSortBy("recent")
    router.push(``)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Search and Filters</h3>
        <div className="space-y-4">
          <Tabs value={searchType} onValueChange={(value: "keyword" | "problem") => setSearchType(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
              <TabsTrigger value="problem">Problem Number</TabsTrigger>
            </TabsList>
            <TabsContent value="keyword">
              <div className="space-y-2">
                <Label htmlFor="keyword">Search by Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="Enter keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="problem">
              <div className="space-y-2">
                <Label htmlFor="problem-number">Search by Problem Number</Label>
                <Input
                  id="problem-number"
                  placeholder="e.g. 1234"
                  value={problemNumber}
                  onChange={(e) => setProblemNumber(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <RadioGroup value={sortBy} onValueChange={setSortBy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recent" id="recent" />
                <Label htmlFor="recent">Most Recent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="views" id="views" />
                <Label htmlFor="views">Most Viewed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="likes" id="likes" />
                <Label htmlFor="likes">Most Liked</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

