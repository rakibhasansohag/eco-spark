"use server"

import httpClient from "@/lib/axios/httpClient"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/api.types"
import { IReview } from "@/types/review.types"

export async function getReviews(ideaId: string) {
  try {
    const res = await httpClient.get<ApiResponse<IReview[]>>(`/reviews?ideaId=${ideaId}`)
    return { success: true, data: res.data?.data || [] }
  } catch (error) {
    console.error("Get Reviews Error:", error)
    return { success: false, data: [] }
  }
}

export async function createReviewAction(payload: { ideaId: string, experience: string, rating: number, effectiveness: number }) {
  try {
    await httpClient.post<ApiResponse<IReview>>("/reviews", payload)
    return { success: true }
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>
    return { success: false, message: err.response?.data?.message || "Failed to submit review" }
  }
}
