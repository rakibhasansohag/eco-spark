"use server"

import { AxiosError } from "axios"
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/category.services"
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "@/zod/category.validation"

interface IActionResult {
  success: boolean
  message: string
}

export const createCategoryAction = async (
  values: unknown
): Promise<IActionResult> => {
  const parsed = createCategoryZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }

  try {
    const result = await createCategory(parsed.data)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Category creation failed" }
  }
}

export const updateCategoryAction = async (
  categoryId: string,
  values: unknown
): Promise<IActionResult> => {
  const parsed = updateCategoryZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }

  try {
    const result = await updateCategory(categoryId, parsed.data)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Category update failed" }
  }
}

export const deleteCategoryAction = async (
  categoryId: string
): Promise<IActionResult> => {
  try {
    const result = await deleteCategory(categoryId)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Category deletion failed" }
  }
}
