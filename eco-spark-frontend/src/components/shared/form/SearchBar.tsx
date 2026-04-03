"use client"

import { Input } from "@/components/ui/input"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"

export function SearchBar({ searchParams }: { searchParams: Record<string, string> }) {
  const { searchTerm, setSearchTerm } = useServerManagedDataTableSearch({ searchParams })

  return (
    <Input
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
