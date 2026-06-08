import { createClient } from "@/lib/supabase/server"
import { IncomeClient } from "@/components/dashboard/income/income-client"

export default async function IncomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [incomeResult, cropsResult] = await Promise.all([
    supabase
      .from("income")
      .select("*, crops(name)")
      .eq("user_id", user?.id)
      .order("income_date", { ascending: false }),
    supabase
      .from("crops")
      .select("id, name")
      .eq("user_id", user?.id)
      .order("name"),
  ])

  return (
    <IncomeClient
      initialIncome={incomeResult.data || []}
      crops={cropsResult.data || []}
    />
  )
}
