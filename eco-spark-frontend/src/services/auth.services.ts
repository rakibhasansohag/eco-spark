"use server";

import axios from "axios";
import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IAuthUser, ILoginPayload, IRegisterPayload } from "@/types/auth.types";

export const register = async (data: IRegisterPayload): Promise<ApiResponse<IAuthUser>> => {
  const res = await httpClient.post<ApiResponse<IAuthUser>>("/auth/register", data);
  return res.data;
};

export const login = async (data: ILoginPayload): Promise<ApiResponse<IAuthUser>> => {
  const res = await httpClient.post<ApiResponse<IAuthUser>>("/auth/login", data);
  return res.data;
};

export const refreshToken = async (): Promise<ApiResponse<null>> => {
  const res = await httpClient.post<ApiResponse<null>>("/auth/refresh-token");
  return res.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const res = await httpClient.post<ApiResponse<null>>("/auth/logout");
  return res.data;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export interface IAuthServerActionResponse {
  result: ApiResponse<IAuthUser>;
  setCookies: string[];
}

export const registerForServerAction = async (
  data: IRegisterPayload
): Promise<IAuthServerActionResponse> => {
  const response = await axios.post<ApiResponse<IAuthUser>>(`${API_BASE_URL}/auth/register`, data, {
    withCredentials: true,
  });
  const setCookies = (response.headers["set-cookie"] ?? []) as string[];
  return { result: response.data, setCookies };
};

export const loginForServerAction = async (
  data: ILoginPayload
): Promise<IAuthServerActionResponse> => {
  const response = await axios.post<ApiResponse<IAuthUser>>(`${API_BASE_URL}/auth/login`, data, {
    withCredentials: true,
  });
  const setCookies = (response.headers["set-cookie"] ?? []) as string[];
  return { result: response.data, setCookies };
};
