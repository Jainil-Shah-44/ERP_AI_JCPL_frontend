"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/layout/DataTable";
import Button from "@/components/ui/Button";
import { getPOList } from "@/services/purchaseorder.service";
import { Column } from "@/components/layout/DataTable";
import { apiFetch } from "@/lib/api";

type PO = {
  id: string;
  po_number: string;
  po_date: string;
  plot_no: string;
  vendor_name: string;
  factory_name?: string;
  total_amount: number;
  status: string;
  created_at: string;
};

const STATUS_TABS = ["ALL", "DRAFT", "RELEASED", "CANCELLED"];

export default function POListPage() {
  const router = useRouter();
  const [pos, setPos] = useState<PO[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [factories, setFactories] = useState<any[]>([]);
  const [filteredFactories, setFilteredFactories] = useState<any[]>([]);
  const [selectedFactory, setSelectedFactory] = useState("");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  useEffect(() => {
    loadPOs();
  }, [activeTab, selectedFactory]);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const data = await apiFetch("/masters/factories/");
        setFilteredFactories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFactories();
  }, []);

  const loadPOs = async () => {
    let factoryParam = selectedFactory ? `&factory_id=${selectedFactory}` : "";

    let statusParam = activeTab !== "ALL" ? `status=${activeTab}&` : "";

    const res = await apiFetch(
      `/purchase-order?${statusParam}page=1&limit=10000${factoryParam}`,
    );

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
            router.push(`/dashboard/procurement/purchase-order/${row.id}`)
          }
        >
          {row.po_number}
        </button>
      ),
    },
    {
      header: "P.No",
      accessor: "plot_no",
    },
    {
      header: "PO Date",
      accessor: "po_date",
      render: (row: PO) => {
        if (!row.po_date) return "-";

        const [year, month, day] = row.po_date.split("-");
        return `${day}/${month}/${year}`;
      },
    },
    {
      header: "Factory",
      accessor: "factory_name",
      render: (row: PO) => row.factory_name || "-",
    },
    {
      header: "Vendor",
      accessor: "vendor_name",
    },
    {
      header: "Total Amount",
      accessor: "total_amount",
      render: (row: PO) => `₹ ${Math.round(row.total_amount || 0)}`,
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Actions",
      render: (row: PO) => (
        <div className="flex gap-2">
          {/* VIEW */}
          <button
            className="text-blue-600 underline text-sm"
            onClick={() =>
              router.push(`/dashboard/procurement/purchase-order/${row.id}`)
            }
          >
            View
          </button>

          {/* EDIT */}
          {row.status === "DRAFT" && (
            <button
              className="text-green-600 underline text-sm"
              onClick={() =>
                router.push(
                  `/dashboard/procurement/purchase-order/${row.id}/edit`,
                )
              }
            >
              Edit
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>

        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2"
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
          >
            <option value="">All Factories</option>

            {filteredFactories.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <Button
            title="Create PO"
            onClick={() =>
              router.push("/dashboard/procurement/purchase-order/create")
            }
          />
        </div>
      </div>
      <div className="flex gap-3 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100"
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
