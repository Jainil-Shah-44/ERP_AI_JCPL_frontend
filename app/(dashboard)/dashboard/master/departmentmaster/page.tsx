"use client";

import { useEffect, useState } from "react";
import {
  getDepartments,
  deleteDepartment,
  Department,
} from "@/services/department.service";
import Button from "@/components/ui/Button";
import Link from "next/link";
import DataTable from "@/components/layout/DataTable";


export default function DepartmentListPage() {
  const [items, setItems] = useState<Department[]>([]);

  const load = async () => {
    setItems(await getDepartments());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;
    await deleteDepartment(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Departments</h1>

        <Link href="/dashboard/master/departmentmaster/create">
          <Button title="Add Department" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Description",
            accessor: "description",
            sortable: true,
            render: (row) => row.description || "-",
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/master/departmentmaster/${row.id}`}
                >
                  <Button title="Edit" variant="secondary" />
                </Link>

                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(row.id)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}