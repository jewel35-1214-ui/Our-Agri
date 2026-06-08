"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Leaf } from "lucide-react"

interface Crop {
  id: string
  name: string
  variety?: string
  status: string
  area_hectares?: number
  planting_date?: string
  expected_harvest_date?: string
}

interface CropOverviewProps {
  crops: Crop[]
}

const statusColors: Record<string, string> = {
  planning: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  planted: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  growing: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  harvesting: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  harvested: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export function CropOverview({ crops }: CropOverviewProps) {
  const recentCrops = crops.slice(0, 5)

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Crop Overview</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/crops">
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentCrops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Leaf className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No crops added yet</p>
            <Button asChild size="sm">
              <Link href="/dashboard/crops">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Crop
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCrops.map((crop) => (
              <div
                key={crop.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{crop.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {crop.variety || "No variety"} 
                      {crop.area_hectares ? ` • ${crop.area_hectares} ha` : ""}
                    </p>
                  </div>
                </div>
                <Badge className={statusColors[crop.status] || statusColors.planning}>
                  {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
