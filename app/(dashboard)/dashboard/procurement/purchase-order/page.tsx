"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/layout/DataTable";
import Button from "@/components/ui/Button";
import { getPOList } from "@/services/purchaseorder.service";
import { Column } from "@/components/layout/DataTable";
type PO = {
  id: string;
  po_number: string;
  po_date: string;
  vendor_name: string;
  total_amount: number;
  status: string;
  created_at: string;
};

const STATUS_TABS = ["ALL", "DRAFT", "RELEASED", "CANCELLED"];

export default function POListPage() {
  const router = useRouter();
  const [pos, setPos] = useState<PO[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    loadPOs();
  }, [activeTab]);

  const loadPOs = async () => {
    const res = await getPOList(1, 20, activeTab);
    setPos(res.data || []);
  };

  const columns: Column<PO>[] = [
    {
      header: "PO Number",
      accessor: "po_number",
      render: (row: PO) => (
        <button
          className="text-blue-600 underline"
          onClick={() =>
            router.push(
              `/dashboard/procurement/purchase-order/${row.id}`
            )
          }
        >
          {row.po_number}
        </button>
      ),
    },
    {
      header: "PO Date",
      accessor: "po_date",
      render: (row: PO) =>
        new Date(row.po_date).toLocaleDateString(),
    },
    {
      header: "Vendor",
      accessor: "vendor_name",
    },
    {
      header: "Total Amount",
      accessor: "total_amount",
      render: (row: PO) => `₹ ${row.total_amount}`,
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">
        Purchase Orders
      </h1>

      <div className="flex gap-3 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable data={pos} columns={columns} pageSize={5} />

    </div>
  );
}