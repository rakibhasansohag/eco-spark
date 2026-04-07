export const authErrorMessages: Record<string, string> = {
  state_mismatch: "Google sign-in session expired. Please try again.",
  google_login_failed: "Google sign-in failed. Please try again.",
  google_login_timeout: "Google sign-in timed out. Please try again.",
  google_finalize_failed: "We could not secure your session. Please try again.",
  access_denied: "Google sign-in was cancelled.",
}

export const getAuthErrorMessage = (errorCode?: string | null): string | null => {
  if (!errorCode) return null
  return authErrorMessages[errorCode] ?? "Google sign-in failed. Please try again."
}
