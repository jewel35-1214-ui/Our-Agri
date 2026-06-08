import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { CropOverview } from "@/components/dashboard/crop-overview"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch dashboard data
  const [cropsResult, expensesResult, incomeResult] = await Promise.all([
    supabase.from("crops").select("*").eq("user_id", user?.id),
    supabase.from("expenses").select("amount, expense_date").eq("user_id", user?.id),
    supabase.from("income").select("amount, income_date").eq("user_id", user?.id),
  ])

  const crops = cropsResult.data || []
  const expenses = expensesResult.data || []
  const income = incomeResult.data || []

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0)
  const profit = totalIncome - totalExpenses

  // Count crops by status
  const activeCrops = crops.filter(c => ["planted", "growing", "harvesting"].includes(c.status)).length
  const harvestedCrops = crops.filter(c => c.status === "harvested").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your farm&apos;s performance.
        </p>
      </div>

      <DashboardStats
        totalCrops={crops.length}
        activeCrops={activeCrops}
        totalExpenses={totalExpenses}
        totalIncome={totalIncome}
        profit={profit}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CropOverview crops={crops} />
        <RecentActivity expenses={expenses} income={income} />
      </div>
    </div>
  )
}
