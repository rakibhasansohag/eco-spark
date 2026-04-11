"use server"

import httpClient from "@/lib/axios/httpClient"
import { ApiResponse } from "@/types/api.types"

export interface INotification {
  id: string
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

export async function getNotificationsAction() {
  try {
    const res = await httpClient.get<ApiResponse<{ notifications: INotification[], unreadCount: number }>>('/notifications')
    return { success: true, data: res.data?.data }
  } catch (error) {
    console.error("Get Notifications Error:", error)
    return { success: false, data: null }
  }
}

export async function markNotificationAsReadAction(id: string) {
  try {
    await httpClient.patch(`/notifications/${id}/read`)
    return { success: true }
  } catch (error) {
    console.error("Mark Notification Error:", error)
    return { success: false }
  }
}
