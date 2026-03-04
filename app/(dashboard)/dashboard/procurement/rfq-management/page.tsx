"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/layout/DataTable";
import Button from "@/components/ui/Button";
import { getRFQs } from "@/services/rfq.service";
import { Column } from "@/components/layout/DataTable";

type RFQ = {
  id: string;
  rfq_number: string;
  rfq_date: string;
  status: string;
  source_pr_id: string;
  created_at: string;
};

const STATUS_TABS = ["ALL", "DRAFT", "SENT", "CLOSED", "CANCELLED"];

export default function RFQListPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [filtered, setFiltered] = useState<RFQ[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRFQs();
  }, []);

  useEffect(() => {
    filterByStatus(activeTab);
  }, [activeTab, rfqs]);

  const loadRFQs = async () => {
    try {
      setLoading(true);
      const res = await getRFQs(1, 20);
      const dataArray = res.data?.data || res.data || [];
      setRfqs(dataArray);
    } catch (error) {
      console.error("Failed to load RFQs", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = (status: string) => {
    if (status === "ALL") {
      setFiltered(rfqs);
    } else {
      setFiltered(rfqs.filter((r) => r.status === status));
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 text-xs rounded font-medium";

    if (status === "DRAFT")
      return <span className={`${base} bg-gray-200 text-gray-700`}>DRAFT</span>;

    if (status === "SENT")
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>SENT</span>;

    if (status === "CLOSED")
      return <span className={`${base} bg-green-100 text-green-700`}>CLOSED</span>;

    if (status === "CANCELLED")
      return <span className={`${base} bg-red-100 text-red-700`}>CANCELLED</span>;

    return <span className={base}>{status}</span>;
  };

  const columns: Column<RFQ>[] = [
    {
      header: "RFQ Number",
      accessor: "rfq_number",
      sortable: true,
    },
    {
      header: "RFQ Date",
      accessor: "rfq_date",
      render: (row: RFQ) =>
        row.rfq_date
          ? new Date(row.rfq_date).toLocaleDateString()
          : "-",
    },
    {
      header: "Source PR",
      accessor: "source_pr_id",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row: RFQ) => getStatusBadge(row.status),
    },
    {
      header: "Created",
      accessor: "created_at",
      render: (row: RFQ) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "-",
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row: RFQ) => (
        <div className="flex gap-2">
          <Button
            title="View"
            variant="secondary"
            onClick={() =>
              router.push(
                `/dashboard/procurement/rfq-management/${row.id}`
              )
            }
          />

          {row.status === "SENT" && (
            <>
              <Button
                title="Enter Quotation"
                variant="primary"
                onClick={() =>
                  router.push(
                    `/dashboard/procurement/rfq-management/${row.id}/enter-quotation`
                  )
                }
              />

              <Button
                title="Comparison"
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/dashboard/procurement/rfq-management/${row.id}/comparison`
                  )
                }
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">RFQ Management</h1>

        <Button
          title="Create RFQ"
          onClick={() =>
            router.push(
              "/dashboard/procurement/rfq-management/create"
            )
          }
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-3 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable data={filtered} columns={columns} pageSize={5} />

      {loading && (
        <p className="text-sm text-gray-500">Loading RFQs...</p>
      )}
    </div>
  );
}