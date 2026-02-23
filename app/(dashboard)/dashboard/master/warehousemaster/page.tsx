"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getWarehouses,
  deleteWarehouse,
  WarehouseMaster,
} from "@/services/warehousemaster.service";
import DataTable from "@/components/layout/DataTable";

export default function WarehouseMasterListPage() {
  const [items, setItems] = useState<WarehouseMaster[]>([]);

  const load = async () => {
    setItems(await getWarehouses());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this warehouse?")) return;
    await deleteWarehouse(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Warehouse Master</h1>

        <Link href="/dashboard/master/warehousemaster/create">
          <Button title="Add Warehouse" />
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
            header: "Location",
            accessor: "location",
            sortable: true,
            render: (row) => row.location || "-",
          },
          {
            header: "State",
            accessor: "state",
            sortable: true,
            render: (row) => row.state || "-",
          },
          {
            header: "Incharge",
            accessor: "incharge",
            sortable: true,
            render: (row) => row.incharge || "-",
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/master/warehousemaster/${row.id}`}
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