"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"
import { cn } from "@/lib/utils"

export function SearchBar({
  searchParams,
  className,
}: {
  searchParams: Record<string, string>
  className?: string
}) {
  const { searchTerm, setSearchTerm, clearSearch } = useServerManagedDataTableSearch({
    searchParams,
  })

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-10 px-9 focus-visible:ring-primary/20"
      />
      {searchTerm ? (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
