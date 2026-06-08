"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createExpense(data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("expenses").insert([
    {
      category: data.category,
      amount: data.amount,
      description: data.description,
      expense_date: data.expense_date,
    },
  ])

  if (error) {
    console.error(error)
    throw new Error("Failed to create expense")
  }

  revalidatePath("/dashboard/expenses")
}

export async function updateExpense(id: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("expenses")
    .update({
      category: data.category,
      amount: data.amount,
      description: data.description,
      expense_date: data.expense_date,
    })
    .eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Failed to update expense")
  }

  revalidatePath("/dashboard/expenses")
}
export async function deleteExpense(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Failed to delete expense")
  }

  revalidatePath("/dashboard/expenses")
}