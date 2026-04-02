"use client"

import { useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"

interface UseServerManagedDataTableSearchArgs {
  searchParams: Record<string, string>
}

export function useServerManagedDataTableSearch({
  searchParams,
}: UseServerManagedDataTableSearchArgs) {
  const router = useRouter()
  const pathname = usePathname()

  const setSearchTerm = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams)
      if (value.trim()) {
        next.set("searchTerm", value.trim())
      } else {
        next.delete("searchTerm")
      }
      next.set("page", "1")
      router.replace(`${pathname}?${next.toString()}`)
      router.refresh()
    },
    [pathname, router, searchParams]
  )

  return {
    searchTerm: searchParams.searchTerm ?? "",
    setSearchTerm,
  }
}
