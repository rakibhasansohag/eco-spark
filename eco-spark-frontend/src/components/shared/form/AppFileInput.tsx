"use client"

import { useRef, useState } from "react"
import { Paperclip, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface AppFileInputProps {
  id: string
  label: string
  onChange: (files: File[]) => void
  accept?: string
  maxFiles?: number
  maxSizeMb?: number
}

export function AppFileInput({
  id,
  label,
  onChange,
  accept = "image/*",
  maxFiles = 5,
  maxSizeMb = 5,
}: AppFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const incoming = Array.from(e.target.files ?? [])

    const oversized = incoming.filter((f) => f.size > maxSizeMb * 1024 * 1024)
    if (oversized.length > 0) {
      setError(`Each file must be under ${maxSizeMb}MB`)
      return
    }

    const merged = [...selected, ...incoming].slice(0, maxFiles)
    setSelected(merged)
    onChange(merged)
    if (inputRef.current) inputRef.current.value = ""
  }

  const remove = (index: number) => {
    const next = selected.filter((_, i) => i !== index)
    setSelected(next)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {selected.length > 0 ? (
        <ul className="space-y-1">
          {selected.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-1.5 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 h-5 w-5 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => remove(i)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {selected.length < maxFiles ? (
        <>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="sr-only"
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => inputRef.current?.click()}
          >
            <Paperclip className="size-3.5" />
            {selected.length === 0 ? "Attach images" : "Add more"}
          </Button>
        </>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <p className="text-xs text-muted-foreground">
        Up to {maxFiles} images · {maxSizeMb}MB each · JPG, PNG, WebP
      </p>
    </div>
  )
}
