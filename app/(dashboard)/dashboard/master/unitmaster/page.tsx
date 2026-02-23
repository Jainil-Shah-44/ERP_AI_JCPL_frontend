"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getUnits,
  deleteUnit,
  UnitMaster,
} from "@/services/unitmaster.service";
import DataTable from "@/components/layout/DataTable";

export default function UnitMasterListPage() {
  const [items, setItems] = useState<UnitMaster[]>([]);

  const load = async () => {
    setItems(await getUnits());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this unit?")) return;
    await deleteUnit(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Unit Master</h1>

        <Link href="/dashboard/master/unitmaster/create">
          <Button title="Add Unit" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "Unit Code",
            accessor: "unit_code",
            sortable: true,
          },
          {
            header: "Description",
            accessor: "description",
            sortable: true,
            render: (row) => row.description || "-",
          },
          {
            header: "Conversion Factor",
            accessor: "conversion_factor",
            sortable: true,
            render: (row) =>
              row.conversion_factor ?? "-",
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/master/unitmaster/${row.id}`}
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