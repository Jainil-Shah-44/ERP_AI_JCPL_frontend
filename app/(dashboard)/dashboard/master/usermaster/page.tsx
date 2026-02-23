"use client";

import { useEffect, useState } from "react";
import { getUsers, deactivateUser, User } from "@/services/user.service";
import Button from "@/components/ui/Button";
import Link from "next/link";
import DataTable from "@/components/layout/DataTable";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    setUsers(await getUsers());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!confirm("Deactivate this user?")) return;
    await deactivateUser(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Users</h1>

        <Link href="/dashboard/master/usermaster/create">
          <Button title="Create User" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={users}
        pageSize={5}
        columns={[
          {
            header: "Username",
            accessor: "username",
            sortable: true,
          },
          {
            header: "Email",
            accessor: "email",
            sortable: true,
            render: (row) => row.email || "-",
          },
          {
            header: "Role",
            accessor: "role",
            sortable: true,
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link href={`/dashboard/master/usermaster/${row.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>

                <Button
                  title="Deactivate"
                  variant="danger"
                  onClick={() => handleDeactivate(row.id)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}