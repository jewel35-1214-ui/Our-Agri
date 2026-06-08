import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, DollarSign, TrendingUp, TrendingDown, Sprout } from "lucide-react"

interface DashboardStatsProps {
  totalCrops: number
  activeCrops: number
  totalExpenses: number
  totalIncome: number
  profit: number
}

export function DashboardStats({
  totalCrops,
  activeCrops,
  totalExpenses,
  totalIncome,
  profit,
}: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      title: "Total Crops",
      value: totalCrops,
      description: `${activeCrops} currently active`,
      icon: Leaf,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Active Crops",
      value: activeCrops,
      description: "Planted or growing",
      icon: Sprout,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      description: "All time",
      icon: TrendingDown,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      description: "All time",
      icon: TrendingUp,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Net Profit",
      value: formatCurrency(profit),
      description: profit >= 0 ? "You're in profit!" : "Keep going!",
      icon: DollarSign,
      iconBg: profit >= 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30",
      iconColor: profit >= 0 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
