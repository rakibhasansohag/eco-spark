"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IInitiatePaymentPayload, IPayment } from "@/types/payment.types";

export const initiatePayment = async (
  data: IInitiatePaymentPayload
): Promise<ApiResponse<{ payment: IPayment; checkoutUrl: string | null }>> => {
  const res = await httpClient.post<ApiResponse<{ payment: IPayment; checkoutUrl: string | null }>>(
    "/payments/initiate",
    data
  );
  return res.data;
};

export const getMyPayments = async (params?: Record<string, string>): Promise<ApiResponse<IPayment[]>> => {
  const res = await httpClient.get<ApiResponse<IPayment[]>>("/payments/my-payments", { params });
  return res.data;
};

export const verifyPayment = async (transactionId: string): Promise<ApiResponse<IPayment>> => {
  const res = await httpClient.get<ApiResponse<IPayment>>(`/payments/verify/${transactionId}`);
  return res.data;
};
