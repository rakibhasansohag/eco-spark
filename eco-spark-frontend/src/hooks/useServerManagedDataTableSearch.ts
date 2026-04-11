"use client"

import { useCallback, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

interface UseServerManagedDataTableSearchArgs {
  searchParams: Record<string, string>
}

export function useServerManagedDataTableSearch({
  searchParams,
}: UseServerManagedDataTableSearchArgs) {
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  
  const currentPropTerm = searchParams.searchTerm ?? ""
  const [localSearchTerm, setLocalSearchTerm] = useState(currentPropTerm)
  const [prevSearchTerm, setPrevSearchTerm] = useState(currentPropTerm)

  if (currentPropTerm !== prevSearchTerm) {
    setPrevSearchTerm(currentPropTerm)
    setLocalSearchTerm(currentPropTerm)
  }

  const triggerSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        const next = new URLSearchParams(searchParams)
        if (value.trim()) {
          next.set("searchTerm", value.trim())
        } else {
          next.delete("searchTerm")
        }
        next.set("page", "1")
        router.replace(`${pathname}?${next.toString()}`)
      }, 500)
    },
    [pathname, router, searchParams]
  )

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value)
    triggerSearch(value)
  }

  const clearSearch = () => {
    setLocalSearchTerm("")
    triggerSearch("")
  }

  return {
    searchTerm: localSearchTerm,
    setSearchTerm: handleSearchChange,
    clearSearch
  }
}
