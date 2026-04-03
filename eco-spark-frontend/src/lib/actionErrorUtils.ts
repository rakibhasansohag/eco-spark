import { AxiosError } from "axios"

type ErrorSource = {
  path?: unknown
  message?: unknown
}

type ErrorPayload = {
  message?: unknown
  errorSources?: ErrorSource[]
}

const normalizePath = (path?: unknown): string => {
  if (typeof path !== "string" || !path) return "_form"
  const cleaned = path.replace(/\[(\d+)\]/g, ".$1")
  const parts = cleaned.split(".").filter(Boolean)
  return parts[parts.length - 1] ?? "_form"
}

export const extractActionError = (
  error: unknown,
  fallbackMessage: string
): { message: string; errors?: Record<string, string[]> } => {
  if (error instanceof AxiosError) {
    const payload = (error.response?.data ?? {}) as ErrorPayload
    const message =
      typeof payload.message === "string" && payload.message.trim().length > 0
        ? payload.message
        : error.message || fallbackMessage

    const mapped: Record<string, string[]> = {}
    if (Array.isArray(payload.errorSources)) {
      for (const source of payload.errorSources) {
        if (typeof source?.message !== "string" || source.message.trim().length === 0) {
          continue
        }
        const key = normalizePath(source.path)
        if (!mapped[key]) mapped[key] = []
        mapped[key].push(source.message)
      }
    }

    return Object.keys(mapped).length > 0 ? { message, errors: mapped } : { message }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return { message: error.message }
  }

  return { message: fallbackMessage }
}

export const firstFieldErrorMessage = (
  errors?: Record<string, string[]>,
  fallback = "Validation failed"
): string => {
  if (!errors) return fallback
  const firstKey = Object.keys(errors)[0]
  if (!firstKey) return fallback
  return errors[firstKey]?.[0] ?? fallback
}
