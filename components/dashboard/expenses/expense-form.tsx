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
import { createExpense, updateExpense } from "@/app/actions/expenses"
import { useRouter } from "next/navigation"

interface Expense {
  id: string
  crop_id?: string
  category: string
  description?: string
  amount: number
  expense_date: string
}

interface Crop {
  id: string
  name: string
}

interface ExpenseFormProps {
  expense?: Expense
  crops: Crop[]
  onSuccess?: () => void
}

interface FormData {
  category: string
  description: string
  amount: string
  expense_date: string
  crop_id: string
}

const categories = [
  { value: "seeds", label: "Seeds" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "pesticides", label: "Pesticides" },
  { value: "labor", label: "Labor" },
  { value: "equipment", label: "Equipment" },
  { value: "irrigation", label: "Irrigation" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
]

export function ExpenseForm({ expense, crops, onSuccess }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      category: expense?.category || "other",
      description: expense?.description || "",
      amount: expense?.amount?.toString() || "",
      expense_date: expense?.expense_date || new Date().toISOString().split("T")[0],
      crop_id: expense?.crop_id || "",
    },
  })

  const category = watch("category")
  const cropId = watch("crop_id")

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = expense
        ? await updateExpense(expense.id, formData)
        : await createExpense(formData)

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={(value) => setValue("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
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
            placeholder="e.g., 5000"
            {...register("amount", { required: "Amount is required" })}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expense_date">Date *</Label>
          <Input
            id="expense_date"
            type="date"
            {...register("expense_date", { required: "Date is required" })}
          />
          {errors.expense_date && (
            <p className="text-sm text-destructive">{errors.expense_date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crop_id">Link to Crop (Optional)</Label>
        <Select value={cropId} onValueChange={(value) => setValue("crop_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a crop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No crop linked</SelectItem>
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
          placeholder="Additional details about this expense..."
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  )
}
