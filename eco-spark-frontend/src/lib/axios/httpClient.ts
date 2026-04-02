"use server";

import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthCookiesForHeader } from "../cookieUtils";
import { getAccessToken, getRefreshToken, shouldRefreshAccessToken } from "../tokenUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

const createHttpClient = async () => {
  const cookieHeader = await getAuthCookiesForHeader();
  const accessToken = await getAccessToken();
  const headers = new AxiosHeaders();

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers,
  });
};

const maybeRefreshAccessToken = async (): Promise<void> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return;

  const isExpiring = await shouldRefreshAccessToken();
  if (!isExpiring) return;

  const client = await createHttpClient();
  await client.post("/auth/refresh-token");
};

const withClient = async <T>(fn: (client: Awaited<ReturnType<typeof createHttpClient>>) => Promise<T>): Promise<T> => {
  await maybeRefreshAccessToken();
  const client = await createHttpClient();
  return fn(client);
};

const httpClient = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    withClient((client) => client.get<T>(url, config)),
  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    withClient((client) => client.post<T>(url, data, config)),
  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    withClient((client) => client.patch<T>(url, data, config)),
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    withClient((client) => client.delete<T>(url, config)),
};

export default httpClient;
