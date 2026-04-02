"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IComment, ICreateCommentPayload, IUpdateCommentPayload } from "@/types/comment.types";

export const getCommentList = async (params?: Record<string, string>): Promise<ApiResponse<IComment[]>> => {
  const res = await httpClient.get<ApiResponse<IComment[]>>("/comments", { params });
  return res.data;
};

export const createComment = async (
  data: ICreateCommentPayload
): Promise<ApiResponse<IComment>> => {
  const res = await httpClient.post<ApiResponse<IComment>>("/comments", data);
  return res.data;
};

export const updateComment = async (
  id: string,
  data: IUpdateCommentPayload
): Promise<ApiResponse<IComment>> => {
  const res = await httpClient.patch<ApiResponse<IComment>>(`/comments/${id}`, data);
  return res.data;
};

export const deleteComment = async (id: string): Promise<ApiResponse<IComment>> => {
  const res = await httpClient.delete<ApiResponse<IComment>>(`/comments/${id}`);
  return res.data;
};
