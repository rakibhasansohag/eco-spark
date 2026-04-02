"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IUpdateProfilePayload, IUpdateUserByAdminPayload, IUser } from "@/types/user.types";

export const getUserList = async (params?: Record<string, string>): Promise<ApiResponse<IUser[]>> => {
  const res = await httpClient.get<ApiResponse<IUser[]>>("/users", { params });
  return res.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<IUser>> => {
  const res = await httpClient.get<ApiResponse<IUser>>(`/users/${id}`);
  return res.data;
};

export const getMyProfile = async (): Promise<ApiResponse<IUser>> => {
  const res = await httpClient.get<ApiResponse<IUser>>("/users/my-profile");
  return res.data;
};

export const updateMyProfile = async (data: IUpdateProfilePayload): Promise<ApiResponse<IUser>> => {
  const res = await httpClient.patch<ApiResponse<IUser>>("/users/my-profile", data);
  return res.data;
};

export const updateUserByAdmin = async (
  id: string,
  data: IUpdateUserByAdminPayload
): Promise<ApiResponse<IUser>> => {
  const res = await httpClient.patch<ApiResponse<IUser>>(`/users/${id}`, data);
  return res.data;
};
