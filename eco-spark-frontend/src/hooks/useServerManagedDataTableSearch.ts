"use client"

import { useCallback, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

interface UseServerManagedDataTableSearchArgs {
  searchParams: Record<string, string>
}

export function useServerManagedDataTableSearch({
  searchParams,
}: UseServerManagedDataTableSearchArgs) {
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<number | null>(null)

  const setSearchTerm = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }

      debounceRef.current = window.setTimeout(() => {
        const next = new URLSearchParams(searchParams)
        if (value.trim()) {
          next.set("searchTerm", value.trim())
        } else {
          next.delete("searchTerm")
        }
        next.set("page", "1")
        router.replace(`${pathname}?${next.toString()}`)
        router.refresh()
      }, 300)
    },
    [pathname, router, searchParams]
  )

  return {
    searchTerm: searchParams.searchTerm ?? "",
    setSearchTerm,
  }
}
