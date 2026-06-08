"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createCrop, updateCrop } from "@/app/actions/crops"
import { useRouter } from "next/navigation"

interface Crop {
  id: string
  name: string
  variety?: string
  field_name?: string
  area_hectares?: number
  planting_date?: string
  expected_harvest_date?: string
  actual_harvest_date?: string
  status: string
  yield_amount?: number
  yield_unit?: string
  notes?: string
}

interface CropFormProps {
  crop?: Crop
  onSuccess?: () => void
}

interface FormData {
  name: string
  variety: string
  field_name: string
  area_hectares: string
  planting_date: string
  expected_harvest_date: string
  actual_harvest_date: string
  status: string
  yield_amount: string
  yield_unit: string
  notes: string
}

const cropStatuses = [
  { value: "planning", label: "Planning" },
  { value: "planted", label: "Planted" },
  { value: "growing", label: "Growing" },
  { value: "harvesting", label: "Harvesting" },
  { value: "harvested", label: "Harvested" },
  { value: "failed", label: "Failed" },
]

const yieldUnits = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "tons", label: "Tons" },
  { value: "bags", label: "Bags" },
  { value: "crates", label: "Crates" },
  { value: "bundles", label: "Bundles" },
]

export function CropForm({ crop, onSuccess }: CropFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: crop?.name || "",
      variety: crop?.variety || "",
      field_name: crop?.field_name || "",
      area_hectares: crop?.area_hectares?.toString() || "",
      planting_date: crop?.planting_date || "",
      expected_harvest_date: crop?.expected_harvest_date || "",
      actual_harvest_date: crop?.actual_harvest_date || "",
      status: crop?.status || "planning",
      yield_amount: crop?.yield_amount?.toString() || "",
      yield_unit: crop?.yield_unit || "kg",
      notes: crop?.notes || "",
    },
  })

  const status = watch("status")
  const yieldUnit = watch("yield_unit")

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = crop
        ? await updateCrop(crop.id, formData)
        : await createCrop(formData)

      if (result.success) {
        router.refresh()
        onSuccess?.()
      } else {
        setError(result.error || "An error occurred")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Crop Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Rice, Corn, Tomatoes"
            {...register("name", { required: "Crop name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="variety">Variety</Label>
          <Input
            id="variety"
            placeholder="e.g., IR64, Yellow Corn"
            {...register("variety")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="field_name">Field/Plot Name</Label>
          <Input
            id="field_name"
            placeholder="e.g., North Field, Plot A"
            {...register("field_name")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area_hectares">Area (hectares)</Label>
          <Input
            id="area_hectares"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 2.5"
            {...register("area_hectares")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="planting_date">Planting Date</Label>
          <Input
            id="planting_date"
            type="date"
            {...register("planting_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected_harvest_date">Expected Harvest</Label>
          <Input
            id="expected_harvest_date"
            type="date"
            {...register("expected_harvest_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_harvest_date">Actual Harvest</Label>
          <Input
            id="actual_harvest_date"
            type="date"
            {...register("actual_harvest_date")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setValue("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {cropStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="yield_amount">Yield Amount</Label>
          <Input
            id="yield_amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 500"
            {...register("yield_amount")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yield_unit">Yield Unit</Label>
          <Select value={yieldUnit} onValueChange={(value) => setValue("yield_unit", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {yieldUnits.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this crop..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : crop ? "Update Crop" : "Add Crop"}
        </Button>
      </div>
    </form>
  )
}
