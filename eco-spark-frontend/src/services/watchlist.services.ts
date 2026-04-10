"use server"

import httpClient from "@/lib/axios/httpClient"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/api.types"
import { IWatchlist } from "@/types/watchlist.types"

export async function getWatchlist(ideaId: string) {
  try {
    const res = await httpClient.get<ApiResponse<IWatchlist[]>>(`/watchlists?ideaId=${ideaId}`)
    return { success: true, data: res.data?.data || [] }
  } catch (error) {
    console.error("Get Watchlist Error:", error)
    return { success: false, data: [] }
  }
}

export async function getMyWatchlist() {
  try {
    const res = await httpClient.get<ApiResponse<IWatchlist[]>>("/watchlists?limit=50")
    return { success: true, data: res.data?.data || [] }
  } catch (error) {
    console.error("Get My Watchlist Error:", error)
    return { success: false, data: [] }
  }
}

export async function toggleWatchlistAction(ideaId: string, isWatchlisted: boolean, recordId?: string) {
  try {
    if (isWatchlisted && recordId) {
      await httpClient.delete<ApiResponse<null>>(`/watchlists/${recordId}`)
    } else {
      await httpClient.post<ApiResponse<IWatchlist>>("/watchlists", { ideaId })
    }
    return { success: true }
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>
    return { success: false, message: err.response?.data?.message || "Failed to update watchlist" }
  }
}

