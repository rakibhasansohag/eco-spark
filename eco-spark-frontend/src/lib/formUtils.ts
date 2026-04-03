export const normalizeErrors = (errors: unknown[]): string[] =>
  errors.map((error) => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) {
      const msg = (error as { message?: unknown }).message
      return typeof msg === "string" ? msg : "Invalid value"
    }
    return "Invalid value"
  })
