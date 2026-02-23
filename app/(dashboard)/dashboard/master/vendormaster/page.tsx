"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getVendors,
  deleteVendor,
  VendorMaster,
} from "@/services/vendormaster.service";
import DataTable from "@/components/layout/DataTable";

export default function VendorMasterListPage() {
  const [items, setItems] = useState<VendorMaster[]>([]);

  const load = async () => {
    setItems(await getVendors());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vendor?")) return;
    await deleteVendor(id);
    load();
  };

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Vendor Master</h1>

        <Link href="/dashboard/master/vendormaster/create">
          <Button title="Add Vendor" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "Vendor Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Mobile 1",
            accessor: "mobile_number1",
            sortable: true,
            render: (row) => row.mobile_number1 || "-",
          },
          {
            header: "GST",
            accessor: "gst_number",
            sortable: true,
            render: (row) => row.gst_number || "-",
          },
          {
            header: "State",
            accessor: "state",
            sortable: true,
            render: (row) => row.state || "-",
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/master/vendormaster/${row.id}`}
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