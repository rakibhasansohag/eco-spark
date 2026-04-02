"use client"

import { useState } from "react"

export function useRowActionModalState<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [rowData, setRowData] = useState<T | null>(null)

  const open = (data: T) => {
    setRowData(data)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setRowData(null)
  }

  return {
    isOpen,
    rowData,
    open,
    close,
    setIsOpen,
  }
}
