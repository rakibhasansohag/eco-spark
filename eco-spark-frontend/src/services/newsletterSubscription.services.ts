"use server";

import httpClient from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateNewsletterSubscriptionPayload,
  INewsletterSubscription,
} from "@/types/newsletterSubscription.types";

export const subscribeNewsletter = async (
  data: ICreateNewsletterSubscriptionPayload
): Promise<ApiResponse<INewsletterSubscription>> => {
  const res = await httpClient.post<ApiResponse<INewsletterSubscription>>(
    "/newsletter-subscriptions",
    data
  );
  return res.data;
};

export const getNewsletterSubscriptions = async (
  params?: Record<string, string>
): Promise<ApiResponse<INewsletterSubscription[]>> => {
  const res = await httpClient.get<ApiResponse<INewsletterSubscription[]>>(
    "/newsletter-subscriptions",
    { params }
  );
  return res.data;
};

export const deleteNewsletterSubscription = async (
  id: string
): Promise<ApiResponse<INewsletterSubscription>> => {
  const res = await httpClient.delete<ApiResponse<INewsletterSubscription>>(
    `/newsletter-subscriptions/${id}`
  );
  return res.data;
};
