import { createClient } from "@/lib/supabase/server"
import { ExpensesClient } from "@/components/dashboard/expenses/expenses-client"

export default async function ExpensesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [expensesResult, cropsResult] = await Promise.all([
    supabase
      .from("expenses")
      .select("*, crops(name)")
      .eq("user_id", user?.id)
      .order("expense_date", { ascending: false }),
    supabase
      .from("crops")
      .select("id, name")
      .eq("user_id", user?.id)
      .order("name"),
  ])

  return (
    <ExpensesClient
      initialExpenses={expensesResult.data || []}
      crops={cropsResult.data || []}
    />
  )
}
