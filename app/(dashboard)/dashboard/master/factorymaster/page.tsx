"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getFactories,
  deleteFactory,
  FactoryMaster,
} from "@/services/factorymaster.service";
import DataTable from "@/components/layout/DataTable";

export default function FactoryMasterListPage() {
  const [items, setItems] = useState<FactoryMaster[]>([]);

  const load = async () => {
    setItems(await getFactories());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this factory?")) return;
    await deleteFactory(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Factory Master</h1>

        <Link href="/dashboard/master/factorymaster/create">
          <Button title="Add Factory" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "Location Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Contact Person",
            accessor: "incharge_name",
            sortable: true,
            render: (row) => row.incharge_name || "-",
          },
          {
            header: "Mobile",
            accessor: "mobile_number",
            sortable: true,
            render: (row) => row.mobile_number || "-",
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/master/factorymaster/${row.id}`}
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