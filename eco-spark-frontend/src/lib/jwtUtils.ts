interface ITokenPayload {
  exp?: number
  userId?: string
  role?: string
  name?: string
  email?: string
}

const base64UrlDecode = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const pad = normalized.length % 4
  const padded = normalized + (pad ? "=".repeat(4 - pad) : "")

  if (typeof atob === "function") {
    return atob(padded)
  }

  return Buffer.from(padded, "base64").toString("utf-8")
}

export const decodeAccessToken = (token?: string): ITokenPayload | null => {
  if (!token) return null

  const parts = token.split(".")
  if (parts.length !== 3 || !parts[1]) return null

  try {
    const payloadString = base64UrlDecode(parts[1])
    const payload = JSON.parse(payloadString) as ITokenPayload
    return payload
  } catch {
    return null
  }
}

export const isTokenExpiringSoon = (
  token?: string,
  thresholdSeconds = 120
): boolean => {
  const decoded = decodeAccessToken(token)
  if (!decoded?.exp) return true
  const current = Math.floor(Date.now() / 1000)
  return decoded.exp - current <= thresholdSeconds
}
