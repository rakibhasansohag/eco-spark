"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { getUserList } from "@/services/user.services"
import { IUser } from "@/types/user.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { updateUserByAdminAction } from "@/app/(dashboardLayout)/admin/dashboard/users-management/_action"

function UserActionsCell({ user }: { user: IUser }) {
  const qc = useQueryClient()

  const toggle = async (field: "role" | "status") => {
    const data =
      field === "role"
        ? { role: (user.role === "ADMIN" ? "MEMBER" : "ADMIN") as "ADMIN" | "MEMBER" }
        : { status: (user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE") as "ACTIVE" | "INACTIVE" }

    const result = await updateUserByAdminAction(user.id, data)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-users"] })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ConfirmDialog
        trigger={
          <Button variant="outline" size="sm">
            {user.role === "ADMIN" ? "Make Member" : "Make Admin"}
          </Button>
        }
        title={`Change Role to ${user.role === "ADMIN" ? "Member" : "Admin"}`}
        description={`This will change ${user.name}'s role. They will have different permissions.`}
        confirmLabel="Confirm"
        variant="default"
        onConfirm={() => toggle("role")}
      />
      <ConfirmDialog
        trigger={
          <Button
            variant="outline"
            size="sm"
            className={user.status === "ACTIVE" ? "text-destructive" : ""}
          >
            {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
          </Button>
        }
        title={`${user.status === "ACTIVE" ? "Deactivate" : "Activate"} User`}
        description={`This will ${user.status === "ACTIVE" ? "prevent" : "allow"} ${user.name} from accessing the platform.`}
        confirmLabel={user.status === "ACTIVE" ? "Deactivate" : "Activate"}
        variant={user.status === "ACTIVE" ? "destructive" : "default"}
        onConfirm={() => toggle("status")}
      />
    </div>
  )
}

const columns: ColumnDef<IUser>[] = [
  {
    header: "User",
    accessorKey: "name",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        image={row.original.image}
      />
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => <StatusBadgeCell status={row.original.role} />,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
]

export default function AdminUsersManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["admin-users", searchParams],
    queryFn: () => getUserList(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<IUser>({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta?.totalPages ?? 0,
    searchParams,
  })

  return (
    <div className="space-y-3">
      <SearchBar searchParams={searchParams} />
      <DataTable table={table} pagination={pagination} />
    </div>
  )
}
