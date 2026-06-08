import { createClient } from "@/lib/supabase/server"
import { AnalyticsClient } from "@/components/dashboard/analytics/analytics-client"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [cropsResult, expensesResult, incomeResult] = await Promise.all([
    supabase
      .from("crops")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user?.id)
      .order("expense_date", { ascending: true }),
    supabase
      .from("income")
      .select("*")
      .eq("user_id", user?.id)
      .order("income_date", { ascending: true }),
  ])

  return (
    <AnalyticsClient
      crops={cropsResult.data || []}
      expenses={expensesResult.data || []}
      income={incomeResult.data || []}
    />
  )
}
