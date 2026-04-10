export const getCookieValue = async (name: string): Promise<string | undefined> => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(name)?.value;
  }
  
  // Client side: Browser handles cookies automatically for axios withCredentials
  // If we really need to read it manually on client (rare for HttpOnly):
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
};

export const getAuthCookiesForHeader = async (): Promise<string> => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  }
  return ""; // Client side: automatic
};
