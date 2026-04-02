"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ICreateVotePayload, IVoteCounts } from "@/types/vote.types";

export const getVoteCounts = async (ideaId: string): Promise<ApiResponse<IVoteCounts>> => {
  const res = await httpClient.get<ApiResponse<IVoteCounts>>(`/votes/${ideaId}`);
  return res.data;
};

export const castOrSwitchVote = async (
  data: ICreateVotePayload
): Promise<ApiResponse<{ id: string }>> => {
  const res = await httpClient.post<ApiResponse<{ id: string }>>("/votes", data);
  return res.data;
};

export const removeVote = async (ideaId: string): Promise<ApiResponse<{ id: string }>> => {
  const res = await httpClient.delete<ApiResponse<{ id: string }>>(`/votes/${ideaId}`);
  return res.data;
};
