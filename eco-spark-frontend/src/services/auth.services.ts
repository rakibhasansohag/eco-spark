"use server";

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
