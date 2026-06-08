"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Beaker, Leaf, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { fertilizerGuides } from "@/app/data/fertilizer-guide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FertilizerGuidePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuide, setSelectedGuide] = useState<(typeof fertilizerGuides)[0] | null>(null)

  const filteredGuides = fertilizerGuides.filter(
  (guide) =>
    guide.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.fertilizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.soilType.toLowerCase().includes(searchTerm.toLowerCase())
)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fertilizer Guide</h1>
        <p className="text-muted-foreground">
          Expert recommendations for fertilizing your crops.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search crops or fertilizers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredGuides.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Beaker className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No guides found</h3>
          <p className="text-muted-foreground">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <Dialog key={guide.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-600" />
                          {guide.cropName}
                        </CardTitle>
                        <CardDescription>{guide.soilType}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        {guide.fertilizerName}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">N: {guide.nitrogenPercentage}%</Badge>
                        <Badge variant="outline">P: {guide.phosphorusPercentage}%</Badge>
                        <Badge variant="outline">K: {guide.potassiumPercentage}%</Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{guide.applicationRate}</p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    {guide.cropName} Fertilization Guide
                  </DialogTitle>
                  <DialogDescription>
                    Comprehensive fertilizer recommendations and best practices
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basics" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="application">Application</TabsTrigger>
                    <TabsTrigger value="practices">Best Practices</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basics" className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">Crop</p>
                        <p className="text-base font-medium">{guide.cropName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">Recommended Fertilizer</p>
                        <p className="text-base font-medium">{guide.fertilizerName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">Soil Type</p>
                        <p className="text-base font-medium">{guide.soilType}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">Application Rate</p>
                        <p className="text-base font-medium">{guide.applicationRate}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm font-semibold">NPK Composition</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-3 rounded">
                          <p className="text-xs text-orange-600 dark:text-orange-300 font-semibold">Nitrogen</p>
                          <p className="text-2xl font-bold text-orange-700 dark:text-orange-200">
                            {guide.nitrogenPercentage}%
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-3 rounded">
                          <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold">Phosphorus</p>
                          <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                            {guide.phosphorusPercentage}%
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 p-3 rounded">
                          <p className="text-xs text-pink-600 dark:text-pink-300 font-semibold">Potassium</p>
                          <p className="text-2xl font-bold text-pink-700 dark:text-pink-200">
                            {guide.potassiumPercentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="application" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">Application Timing</p>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border-l-4 border-green-500">
                        <p className="font-medium">{guide.applicationTiming}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">Optimal Season</p>
                      <p className="text-base">{guide.season}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="practices" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      {guide.bestPractices.map((practice, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded"
                        >
                          <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{practice}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  )
}
