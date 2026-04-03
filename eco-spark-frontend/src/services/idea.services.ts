"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ICreateIdeaPayload, IIdea, IUpdateIdeaPayload } from "@/types/idea.types";

export const getIdeaList = async (params?: Record<string, string>): Promise<ApiResponse<IIdea[]>> => {
  const res = await httpClient.get<ApiResponse<IIdea[]>>("/ideas", { params });
  return res.data;
};

export const getIdeaById = async (id: string): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.get<ApiResponse<IIdea>>(`/ideas/${id}`);
  return res.data;
};

export const getMyIdeas = async (params?: Record<string, string>): Promise<ApiResponse<IIdea[]>> => {
  const res = await httpClient.get<ApiResponse<IIdea[]>>("/ideas/my-ideas", { params });
  return res.data;
};

export const getIdeasForAdmin = async (params?: Record<string, string>): Promise<ApiResponse<IIdea[]>> => {
  const res = await httpClient.get<ApiResponse<IIdea[]>>("/ideas/admin-all", { params });
  return res.data;
};

export const createIdea = async (
  data: ICreateIdeaPayload | FormData,
): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.post<ApiResponse<IIdea>>("/ideas", data);
  return res.data;
};

export const updateIdea = async (id: string, data: IUpdateIdeaPayload): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.patch<ApiResponse<IIdea>>(`/ideas/${id}`, data);
  return res.data;
};

export const deleteIdea = async (id: string): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.delete<ApiResponse<IIdea>>(`/ideas/${id}`);
  return res.data;
};

export const submitIdea = async (id: string): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.patch<ApiResponse<IIdea>>(`/ideas/${id}/submit`);
  return res.data;
};

export const approveIdea = async (id: string): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.patch<ApiResponse<IIdea>>(`/ideas/${id}/approve`);
  return res.data;
};

export const rejectIdea = async (
  id: string,
  data: { rejectionFeedback: string }
): Promise<ApiResponse<IIdea>> => {
  const res = await httpClient.patch<ApiResponse<IIdea>>(`/ideas/${id}/reject`, data);
  return res.data;
};
