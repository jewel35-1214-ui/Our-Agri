"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCrop(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const cropData = {
    user_id: user.id,
    name: formData.get("name") as string,
    variety: formData.get("variety") as string || null,
    field_name: formData.get("field_name") as string || null,
    area_hectares: formData.get("area_hectares") ? parseFloat(formData.get("area_hectares") as string) : null,
    planting_date: formData.get("planting_date") as string || null,
    expected_harvest_date: formData.get("expected_harvest_date") as string || null,
    actual_harvest_date: formData.get("actual_harvest_date") as string || null,
    status: formData.get("status") as string || "planning",
    yield_amount: formData.get("yield_amount") ? parseFloat(formData.get("yield_amount") as string) : null,
    yield_unit: formData.get("yield_unit") as string || "kg",
    notes: formData.get("notes") as string || null,
  }

  const { error } = await supabase.from("crops").insert(cropData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/crops")
  return { success: true }
}

export async function updateCrop(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const cropData = {
    name: formData.get("name") as string,
    variety: formData.get("variety") as string || null,
    field_name: formData.get("field_name") as string || null,
    area_hectares: formData.get("area_hectares") ? parseFloat(formData.get("area_hectares") as string) : null,
    planting_date: formData.get("planting_date") as string || null,
    expected_harvest_date: formData.get("expected_harvest_date") as string || null,
    actual_harvest_date: formData.get("actual_harvest_date") as string || null,
    status: formData.get("status") as string || "planning",
    yield_amount: formData.get("yield_amount") ? parseFloat(formData.get("yield_amount") as string) : null,
    yield_unit: formData.get("yield_unit") as string || "kg",
    notes: formData.get("notes") as string || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("crops")
    .update(cropData)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/crops")
  return { success: true }
}

export async function deleteCrop(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("crops")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/crops")
  return { success: true }
}
