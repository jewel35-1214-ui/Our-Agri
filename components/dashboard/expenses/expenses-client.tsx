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
import { Plus, Search, Pencil, Trash2, Receipt } from "lucide-react"
import { ExpenseForm } from "./expense-form"
import { deleteExpense } from "@/app/actions/expenses"
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

interface Expense {
  id: string
  crop_id?: string
  category: string
  description?: string
  amount: number
  currency: string
  expense_date: string
  crops?: { name: string } | null
}

interface Crop {
  id: string
  name: string
}

interface ExpensesClientProps {
  initialExpenses: Expense[]
  crops: Crop[]
}

const categoryColors: Record<string, string> = {
  seeds: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  fertilizer: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  pesticides: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  labor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  equipment: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  irrigation: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  transport: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export function ExpensesClient({ initialExpenses, crops }: ExpensesClientProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.crops?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false)
    setEditingExpense(null)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deletingExpense) return
    setIsDeleting(true)
    try {
      const result = await deleteExpense(deletingExpense.id)
      if (result.success) {
        setExpenses(expenses.filter((e) => e.id !== deletingExpense.id))
      }
    } finally {
      setIsDeleting(false)
      setDeletingExpense(null)
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track all your farm expenses and costs.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record a new expense for your farm.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm crops={crops} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Receipt className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No expenses found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try a different search term" : "Start tracking your farm expenses"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Linked Crop</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.expense_date)}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[expense.category] || categoryColors.other}>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.description || "-"}</TableCell>
                  <TableCell>{expense.crops?.name || "-"}</TableCell>
                  <TableCell className="text-right font-medium text-red-600 dark:text-red-400">
                    -{formatCurrency(Number(expense.amount))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingExpense(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingExpense(expense)}
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
      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the expense details below.
            </DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm expense={editingExpense} crops={crops} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingExpense} onOpenChange={(open) => !open && setDeletingExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
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
