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

  const updateFilters = useCallback(
    (entries: Record<string, string>) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(entries).forEach(([key, value]) => {
        if (value) next.set(key, value)
        else next.delete(key)
      })
      next.set("page", "1")
      router.replace(`${pathname}?${next.toString()}`)
      router.refresh()
    },
    [pathname, router, searchParams]
  )

  const setFilter = useCallback(
    (key: string, value: string) => {
      updateFilters({ [key]: value })
    },
    [updateFilters]
  )

  return {
    setFilter,
    setFilters: updateFilters,
  }
}
