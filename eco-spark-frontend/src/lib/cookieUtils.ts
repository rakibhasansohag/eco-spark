import { cookies } from "next/headers";

export const getCookieValue = async (name: string): Promise<string | undefined> => {
  const store = await cookies();
  return store.get(name)?.value;
};

export const getAuthCookiesForHeader = async (): Promise<string> => {
  const store = await cookies();
  return store
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};
