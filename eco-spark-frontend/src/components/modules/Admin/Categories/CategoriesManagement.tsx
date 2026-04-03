"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getCategoryList } from "@/services/category.services"
import { ICategory } from "@/types/category.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/(dashboardLayout)/admin/dashboard/categories-management/_action"

function CreateCategoryDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [pending, setPending] = useState(false)
  const qc = useQueryClient()

  const handleCreate = async () => {
    setPending(true)
    const result = await createCategoryAction({ name })
    setPending(false)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-categories"] })
      setOpen(false)
      setName("")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="new-category-name">Name</Label>
          <Input
            id="new-category-name"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={pending || name.length < 2}>
            {pending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditCategoryDialog({ category }: { category: ICategory }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category.name)
  const [pending, setPending] = useState(false)
  const qc = useQueryClient()

  const handleUpdate = async () => {
    setPending(true)
    const result = await updateCategoryAction(category.id, { name })
    setPending(false)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-categories"] })
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="edit-category-name">Name</Label>
          <Input
            id="edit-category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={pending || name.length < 2}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CategoryActionsCell({ category }: { category: ICategory }) {
  const qc = useQueryClient()

  const handleDelete = async () => {
    const result = await deleteCategoryAction(category.id)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-categories"] })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <EditCategoryDialog category={category} />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        }
        title="Delete Category"
        description={`Delete "${category.name}"? Ideas using this category may be affected.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}

const columns: ColumnDef<ICategory>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CategoryActionsCell category={row.original} />,
  },
]

export default function AdminCategoriesManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["admin-categories", searchParams],
    queryFn: () => getCategoryList(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<ICategory>({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta?.totalPages ?? 0,
    searchParams,
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <SearchBar searchParams={searchParams} />
        <CreateCategoryDialog />
      </div>
      <DataTable table={table} pagination={pagination} />
    </div>
  )
}
