"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardStats, IMemberDashboardStats } from "@/types/dashboard.types";

export const getAdminDashboardStats = async (): Promise<ApiResponse<IAdminDashboardStats>> => {
  const res = await httpClient.get<ApiResponse<IAdminDashboardStats>>("/dashboard/admin-stats");
  return res.data;
};

export const getMemberDashboardStats = async (): Promise<ApiResponse<IMemberDashboardStats>> => {
  const res = await httpClient.get<ApiResponse<IMemberDashboardStats>>("/dashboard/member-stats");
  return res.data;
};
