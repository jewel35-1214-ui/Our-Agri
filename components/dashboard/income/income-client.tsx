"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, DollarSign } from "lucide-react"
import { IncomeForm } from "./income-form"
import { deleteIncome } from "@/app/actions/income"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Income {
  id: string
  crop_id?: string
  source: string
  description?: string
  amount: number
  income_date: string
  crops?: { name: string } | null
}

interface Crop {
  id: string
  name: string
}

interface IncomeClientProps {
  initialIncome: Income[]
  crops: Crop[]
}

const sourceColors: Record<string, string> = {
  crop_sale: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  livestock_sale: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  equipment_rental: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  agritourism: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  subsidy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export function IncomeClient({ initialIncome, crops }: IncomeClientProps) {
  const [income, setIncome] = useState<Income[]>(initialIncome)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [deletingIncome, setDeletingIncome] = useState<Income | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const filteredIncome = income.filter(
    (inc) =>
      inc.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.crops?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalIncome = filteredIncome.reduce((sum, i) => sum + Number(i.amount), 0)

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false)
    setEditingIncome(null)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deletingIncome) return
    setIsDeleting(true)
    try {
      const result = await deleteIncome(deletingIncome.id)
      if (result.success) {
        setIncome(income.filter((i) => i.id !== deletingIncome.id))
      }
    } finally {
      setIsDeleting(false)
      setDeletingIncome(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getSourceLabel = (source: string) => {
    const sources: Record<string, string> = {
      crop_sale: "Crop Sale",
      livestock_sale: "Livestock Sale",
      equipment_rental: "Equipment Rental",
      agritourism: "Agritourism",
      subsidy: "Government Subsidy",
      other: "Other",
    }
    return sources[source] || source
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">
            Track all your farm income and revenue sources.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
              <DialogDescription>
                Record a new income source for your farm.
              </DialogDescription>
            </DialogHeader>
            <IncomeForm crops={crops} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search income..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</span>
        </div>
      </div>

      {filteredIncome.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No income recorded</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try a different search term" : "Start recording your farm income"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Linked Crop</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncome.map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell>{formatDate(inc.income_date)}</TableCell>
                  <TableCell>
                    <Badge className={sourceColors[inc.source] || sourceColors.other}>
                      {getSourceLabel(inc.source)}
                    </Badge>
                  </TableCell>
                  <TableCell>{inc.description || "-"}</TableCell>
                  <TableCell>{inc.crops?.name || "-"}</TableCell>
                  <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                    +{formatCurrency(Number(inc.amount))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingIncome(inc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingIncome(inc)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingIncome} onOpenChange={(open) => !open && setEditingIncome(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
            <DialogDescription>
              Update the income details below.
            </DialogDescription>
          </DialogHeader>
          {editingIncome && (
            <IncomeForm income={editingIncome} crops={crops} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingIncome} onOpenChange={(open) => !open && setDeletingIncome(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Income</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this income record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
