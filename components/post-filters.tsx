"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function PostFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchType, setSearchType] = useState<"keyword" | "problem">("keyword")
  const [keyword, setKeyword] = useState("BOJ")
  const [problemNumber, setProblemNumber] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    // URL에서 필터 값 초기화
    const keywordParam = searchParams.get("keyword")
    const problemParam = searchParams.get("problem_number")
    const sortParam = searchParams.get("sort_by")
    const modeParam = searchParams.get("mode")

    if (modeParam) {
      setSearchType(modeParam as "keyword" | "problem")
    } else if (keywordParam) {
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

    // mode 파라미터를 명시적으로 추가
    params.set("mode", searchType)

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
    setKeyword("BOJ")
    setProblemNumber("")
    setSortBy("recent")
    router.push(``)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Search and Filters</h3>
        <div className="space-y-4">
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "keyword" | "problem")}>
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
