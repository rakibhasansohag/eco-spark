"use client"

import { useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"

interface UseServerManagedDataTableFiltersArgs {
  searchParams: Record<string, string>
}

export function useServerManagedDataTableFilters({
  searchParams,
}: UseServerManagedDataTableFiltersArgs) {
  const router = useRouter()
  const pathname = usePathname()

  const setFilter = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      next.set("page", "1")
      router.replace(`${pathname}?${next.toString()}`)
      router.refresh()
    },
    [pathname, router, searchParams]
  )

  return {
    setFilter,
  }
}
