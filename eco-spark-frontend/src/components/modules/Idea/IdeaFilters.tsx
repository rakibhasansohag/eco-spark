"use client"

import { useRouter, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getCategoryList } from "@/services/category.services"
import { ICategory } from "@/types/category.types"
import { Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface IdeaFiltersProps {
  searchParams: Record<string, string>
}

const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt:desc" },
  { label: "Oldest First", value: "createdAt:asc" },
]

const PAYMENT_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Free Only", value: "false" },
  { label: "Paid Only", value: "true" },
]

export function IdeaFilters({ searchParams }: IdeaFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-filter"],
    queryFn: () => getCategoryList(),
    staleTime: 1000 * 60 * 5,
  })

  const categories: ICategory[] = categoriesData?.data ?? []

  const currentCategory = searchParams.categoryId ?? "all"
  const currentIsPaid = searchParams.isPaid ?? "all"
  const currentSort = searchParams.sortBy && searchParams.sortOrder
    ? `${searchParams.sortBy}:${searchParams.sortOrder}`
    : "createdAt:desc"

  const activeFilterCount = [
    currentCategory !== "all" ? 1 : 0,
    currentIsPaid !== "all" ? 1 : 0,
    currentSort !== "createdAt:desc" ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const updateParam = (key: string | Record<string, string | null>, value?: string | null) => {
    const params = new URLSearchParams(searchParams)
    params.delete("page") // reset to page 1 on filter change

    if (typeof key === "object") {
      Object.entries(key).forEach(([k, v]) => {
        if (v === null) params.delete(k)
        else params.set(k, v)
      })
    } else {
      if (value === null || value === undefined || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (searchParams.search) params.set("search", searchParams.search)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0">
        <SlidersHorizontal className="size-3.5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="default" className="h-4 min-w-4 px-1 text-[10px] font-bold">
            {activeFilterCount}
          </Badge>
        )}
      </div>

      {/* Category Filter */}
      <Select
        value={currentCategory}
        onValueChange={(val) => updateParam("categoryId", val)}
      >
        <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs gap-1.5 border-dashed">
          <Filter className="size-3 text-muted-foreground" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment Status Filter */}
      <Select
        value={currentIsPaid}
        onValueChange={(val) => updateParam("isPaid", val)}
      >
        <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs gap-1.5 border-dashed">
          <SelectValue placeholder="Payment" />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={currentSort}
        onValueChange={(val) => {
          const [sortBy, sortOrder] = val.split(":")
          updateParam({ sortBy, sortOrder })
        }}
      >
        <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs gap-1.5 border-dashed">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={clearAllFilters}
        >
          <X className="size-3" />
          Clear
        </Button>
      )}
    </div>
  )
}
