"use server"

import { revalidatePath } from "next/cache"
import { AxiosError } from "axios"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.services"
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "@/zod/category.validation"

interface ActionResult {
  success: boolean
  message: string
}

export async function createCategoryAction(values: unknown): Promise<ActionResult> {
  const parsed = createCategoryZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Category name is required (min 2 chars)" }
  }
  try {
    const result = await createCategory(parsed.data)
    revalidatePath("/admin/dashboard/categories-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to create category" }
  }
}

export async function updateCategoryAction(
  id: string,
  values: unknown,
): Promise<ActionResult> {
  const parsed = updateCategoryZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }
  try {
    const result = await updateCategory(id, parsed.data)
    revalidatePath("/admin/dashboard/categories-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to update category" }
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const result = await deleteCategory(id)
    revalidatePath("/admin/dashboard/categories-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to delete category" }
  }
}
