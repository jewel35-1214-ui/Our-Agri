"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react"

interface Crop {
  id: string
  name: string
  status: string
  yield_amount?: number
  planting_date?: string
  actual_harvest_date?: string
}

interface Expense {
  id: string
  category: string
  amount: number
  expense_date: string
}

interface Income {
  id: string
  source: string
  amount: number
  income_date: string
}

interface AnalyticsClientProps {
  crops: Crop[]
  expenses: Expense[]
  income: Income[]
}

export function AnalyticsClient({ crops, expenses, income }: AnalyticsClientProps) {
  // Calculate various analytics
  const analytics = useMemo(() => {
    // Expense analysis
    const expenseByCategory = expenses.reduce(
      (acc, exp) => {
        const existing = acc.find((item) => item.name === exp.category)
        if (existing) {
          existing.value += Number(exp.amount)
        } else {
          acc.push({ name: exp.category.charAt(0).toUpperCase() + exp.category.slice(1), value: Number(exp.amount) })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>
    )

    // Income analysis
    const incomeBySource = income.reduce(
      (acc, inc) => {
        const sourceLabel =
          inc.source === "crop_sale"
            ? "Crop Sale"
            : inc.source === "livestock_sale"
              ? "Livestock Sale"
              : inc.source === "equipment_rental"
                ? "Equipment Rental"
                : inc.source === "agritourism"
                  ? "Agritourism"
                  : inc.source === "subsidy"
                    ? "Subsidy"
                    : "Other"
        const existing = acc.find((item) => item.name === sourceLabel)
        if (existing) {
          existing.value += Number(inc.amount)
        } else {
          acc.push({ name: sourceLabel, value: Number(inc.amount) })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>
    )

    // Monthly trend (last 12 months)
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        month: date.toLocaleString("en-US", { month: "short" }),
        monthNum: date.getMonth(),
        year: date.getFullYear(),
      })
    }

    const monthlyTrend = months.map((m) => {
      const monthExpenses = expenses
        .filter((e) => {
          const expDate = new Date(e.expense_date)
          return expDate.getMonth() === m.monthNum && expDate.getFullYear() === m.year
        })
        .reduce((sum, e) => sum + Number(e.amount), 0)

      const monthIncome = income
        .filter((i) => {
          const incDate = new Date(i.income_date)
          return incDate.getMonth() === m.monthNum && incDate.getFullYear() === m.year
        })
        .reduce((sum, i) => sum + Number(i.amount), 0)

      return {
        month: m.month,
        expenses: monthExpenses,
        income: monthIncome,
        profit: monthIncome - monthExpenses,
      }
    })

    // Crop status distribution
    const cropStatusDistribution = crops.reduce(
      (acc, crop) => {
        const existing = acc.find((item) => item.name === crop.status)
        if (existing) {
          existing.value += 1
        } else {
          const statusLabel =
            crop.status === "planning"
              ? "Planning"
              : crop.status === "planted"
                ? "Planted"
                : crop.status === "growing"
                  ? "Growing"
                  : crop.status === "harvesting"
                    ? "Harvesting"
                    : crop.status === "harvested"
                      ? "Harvested"
                      : "Failed"
          acc.push({ name: statusLabel, value: 1 })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>
    )

    // Total calculations
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0)
    const netProfit = totalIncome - totalExpenses

    return {
      expenseByCategory,
      incomeBySource,
      monthlyTrend,
      cropStatusDistribution,
      totalExpenses,
      totalIncome,
      netProfit,
    }
  }, [crops, expenses, income])

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-2 rounded shadow-lg border border-slate-200 dark:border-slate-700">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your farm&apos;s financial and crop performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(analytics.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            <PieChartIcon className="h-4 w-4" style={{ color: analytics.netProfit >= 0 ? "#10b981" : "#ef4444" }} />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              style={{ color: analytics.netProfit >= 0 ? "#10b981" : "#ef4444" }}
            >
              {formatCurrency(analytics.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="income">Income Breakdown</TabsTrigger>
          <TabsTrigger value="crops">Crop Status</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
              <CardDescription>12-month financial trend</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.monthlyTrend.some((m) => m.expenses > 0 || m.income > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Distribution of your farm expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.expenseByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#ef4444" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income by Source</CardTitle>
              <CardDescription>Distribution of your farm income</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.incomeBySource.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.incomeBySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#10b981"
                      dataKey="value"
                    >
                      {analytics.incomeBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No income data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops">
          <Card>
            <CardHeader>
              <CardTitle>Crop Status Distribution</CardTitle>
              <CardDescription>Current status of all your crops</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.cropStatusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.cropStatusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#3b82f6"
                      dataKey="value"
                    >
                      {analytics.cropStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No crop data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
