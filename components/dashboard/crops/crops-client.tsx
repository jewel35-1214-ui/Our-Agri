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
import { Plus, Search, Pencil, Trash2, Leaf } from "lucide-react"
import { CropForm } from "./crop-form"
import { deleteCrop } from "@/app/actions/crops"
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
  created_at: string
}

interface CropsClientProps {
  initialCrops: Crop[]
}

const statusColors: Record<string, string> = {
  planning: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  planted: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  growing: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  harvesting: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  harvested: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export function CropsClient({ initialCrops }: CropsClientProps) {
  const [crops, setCrops] = useState<Crop[]>(initialCrops)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null)
  const [deletingCrop, setDeletingCrop] = useState<Crop | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const filteredCrops = crops.filter(
    (crop) =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.field_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false)
    setEditingCrop(null)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deletingCrop) return
    setIsDeleting(true)
    try {
      const result = await deleteCrop(deletingCrop.id)
      if (result.success) {
        setCrops(crops.filter((c) => c.id !== deletingCrop.id))
      }
    } finally {
      setIsDeleting(false)
      setDeletingCrop(null)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
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
          <h1 className="text-2xl font-bold tracking-tight">My Crops</h1>
          <p className="text-muted-foreground">
            Manage and track all your crops in one place.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
              <DialogDescription>
                Enter the details of your new crop below.
              </DialogDescription>
            </DialogHeader>
            <CropForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredCrops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Leaf className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No crops found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try a different search term" : "Get started by adding your first crop"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Crop
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop Name</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Area (ha)</TableHead>
                <TableHead>Planted</TableHead>
                <TableHead>Expected Harvest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      {crop.variety && (
                        <p className="text-sm text-muted-foreground">{crop.variety}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{crop.field_name || "-"}</TableCell>
                  <TableCell>{crop.area_hectares || "-"}</TableCell>
                  <TableCell>{formatDate(crop.planting_date)}</TableCell>
                  <TableCell>{formatDate(crop.expected_harvest_date)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[crop.status] || statusColors.planning}>
                      {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCrop(crop)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCrop(crop)}
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
      <Dialog open={!!editingCrop} onOpenChange={(open) => !open && setEditingCrop(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Crop</DialogTitle>
            <DialogDescription>
              Update the details of your crop below.
            </DialogDescription>
          </DialogHeader>
          {editingCrop && (
            <CropForm crop={editingCrop} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCrop} onOpenChange={(open) => !open && setDeletingCrop(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Crop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCrop?.name}&quot;? This action cannot be undone.
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
