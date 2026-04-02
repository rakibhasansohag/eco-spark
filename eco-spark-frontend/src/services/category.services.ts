"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICategory,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/types/category.types";

export const getCategoryList = async (params?: Record<string, string>): Promise<ApiResponse<ICategory[]>> => {
  const res = await httpClient.get<ApiResponse<ICategory[]>>("/categories", { params });
  return res.data;
};

export const createCategory = async (
  data: ICreateCategoryPayload
): Promise<ApiResponse<ICategory>> => {
  const res = await httpClient.post<ApiResponse<ICategory>>("/categories", data);
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: IUpdateCategoryPayload
): Promise<ApiResponse<ICategory>> => {
  const res = await httpClient.patch<ApiResponse<ICategory>>(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<ApiResponse<ICategory>> => {
  const res = await httpClient.delete<ApiResponse<ICategory>>(`/categories/${id}`);
  return res.data;
};
