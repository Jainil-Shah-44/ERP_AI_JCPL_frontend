"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getRawMaterials,
  deleteRawMaterial,
  RawMaterialMaster,
} from "@/services/rawmaterialmaster.service";
import DataTable from "@/components/layout/DataTable";

export default function RawMaterialMasterListPage() {
  const [items, setItems] = useState<RawMaterialMaster[]>([]);

  const load = async () => {
    setItems(await getRawMaterials());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this raw material?")) return;
    await deleteRawMaterial(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Raw Material Master</h1>

        <Link href="/dashboard/master/rawmaterialmaster/create">
          <Button title="Add Material" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "Code",
            accessor: "material_code",
            sortable: true,
          },
          {
            header: "Name",
            accessor: "material_name",
            sortable: true,
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/master/rawmaterialmaster/${row.id}`}
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