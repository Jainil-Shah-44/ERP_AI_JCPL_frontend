"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getCategories,
  deleteCategory,
  CategoryMaster,
} from "@/services/categorymaster.service";
import DataTable from "@/components/layout/DataTable";

export default function CategoryMasterListPage() {
  const [items, setItems] = useState<CategoryMaster[]>([]);

  const load = async () => {
    setItems(await getCategories());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Category Master</h1>

        <Link href="/dashboard/master/categorymaster/create">
          <Button title="Add Category" />
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
                  href={`/dashboard/master/categorymaster/${row.id}`}
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