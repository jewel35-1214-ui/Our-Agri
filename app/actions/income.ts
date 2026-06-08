"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createIncome(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase.from("income").insert([
    {
      user_id: user.id,
      crop_id: data.crop_id || null,
      source: data.source,
      amount: parseFloat(data.amount),
      description: data.description || null,
      income_date: data.income_date,
      currency: "PHP",
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/income")
  return { success: true }
}

export async function updateIncome(id: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("income")
    .update({
      crop_id: data.crop_id || null,
      source: data.source,
      amount: parseFloat(data.amount),
      description: data.description || null,
      income_date: data.income_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/income")
  return { success: true }
}

export async function deleteIncome(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("income")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/income")
  return { success: true }
}
