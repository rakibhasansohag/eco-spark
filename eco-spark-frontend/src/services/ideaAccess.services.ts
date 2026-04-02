"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IIdeaAccess, IIdeaAccessCheck } from "@/types/ideaAccess.types";

export const getMyIdeaAccesses = async (
  params?: Record<string, string>
): Promise<ApiResponse<IIdeaAccess[]>> => {
  const res = await httpClient.get<ApiResponse<IIdeaAccess[]>>("/idea-accesses/my-accesses", { params });
  return res.data;
};

export const checkIdeaAccess = async (ideaId: string): Promise<ApiResponse<IIdeaAccessCheck>> => {
  const res = await httpClient.get<ApiResponse<IIdeaAccessCheck>>(`/idea-accesses/${ideaId}/check`);
  return res.data;
};
