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
import { createIncome, updateIncome } from "@/app/actions/income"
import { useRouter } from "next/navigation"

interface Income {
  id: string
  crop_id?: string
  source: string
  description?: string
  amount: number
  income_date: string
}

interface Crop {
  id: string
  name: string
}

interface IncomeFormProps {
  income?: Income
  crops: Crop[]
  onSuccess?: () => void
}

interface FormData {
  source: string
  description: string
  amount: string
  income_date: string
  crop_id: string
}

const incomeSources = [
  { value: "crop_sale", label: "Crop Sale" },
  { value: "livestock_sale", label: "Livestock Sale" },
  { value: "equipment_rental", label: "Equipment Rental" },
  { value: "agritourism", label: "Agritourism" },
  { value: "subsidy", label: "Government Subsidy" },
  { value: "other", label: "Other" },
]

export function IncomeForm({ income, crops, onSuccess }: IncomeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      source: income?.source || "crop_sale",
      description: income?.description || "",
      amount: income?.amount?.toString() || "",
      income_date: income?.income_date || new Date().toISOString().split("T")[0],
      // FIX: Fallback to "none" instead of "" if there's no initial crop
      crop_id: income?.crop_id || "none",
    },
  })

  const source = watch("source")
  const cropId = watch("crop_id")

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const submitData = {
        source: data.source,
        description: data.description,
        amount: data.amount,
        income_date: data.income_date,
        // FIX: Treat "none" as null when sending data back to Server Actions
        crop_id: data.crop_id === "none" || !data.crop_id ? null : data.crop_id,
      }

      const result = income
        ? await updateIncome(income.id, submitData)
        : await createIncome(submitData)

      if (result?.success) {
        router.refresh()
        onSuccess?.()
      } else {
        setError(result?.error || "An error occurred")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="source">Income Source *</Label>
        <Select value={source} onValueChange={(value) => setValue("source", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {incomeSources.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (PHP) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 15000"
            {...register("amount", { required: "Amount is required" })}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="income_date">Date *</Label>
          <Input
            id="income_date"
            type="date"
            {...register("income_date", { required: "Date is required" })}
          />
          {errors.income_date && (
            <p className="text-sm text-destructive">{errors.income_date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crop_id">Related Crop (Optional)</Label>
        <Select value={cropId} onValueChange={(value) => setValue("crop_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a crop" />
          </SelectTrigger>
          <SelectContent>
            {/* FIX: Changed value from "" to "none" to stop Radix UI from crashing */}
            <SelectItem value="none">No crop linked</SelectItem>
            {crops.map((crop) => (
              <SelectItem key={crop.id} value={crop.id}>
                {crop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Additional details about this income..."
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : income ? "Update Income" : "Add Income"}
        </Button>
      </div>
    </form>
  )
}