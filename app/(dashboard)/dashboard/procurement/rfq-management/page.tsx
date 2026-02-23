"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/layout/DataTable";
import Button from "@/components/ui/Button";
import { getPurchaseRequisitions } from "@/services/purchaserequisition.service";

export default function ApprovedPRList() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  const load = async () => {
    try {
      const res = await getPurchaseRequisitions(1, 20);

      const dataArray = res.data?.data || res.data || [];

      const approvedOnly = dataArray.filter(
        (item: any) => item.status?.toUpperCase() === "APPROVED"
      );

      setItems(approvedOnly);
    } catch (error) {
      console.error("Failed to load PRs", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Approved Purchase Requisitions
        </h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "PR Number",
            accessor: "pr_number",
            sortable: true,
          },
          {
            header: "Department",
            accessor: "department",
            sortable: true,
          },
          {
            header: "Priority",
            accessor: "priority",
            sortable: true,
          },
          {
            header: "Required Date",
            accessor: "required_by_date",
            sortable: true,
            render: (row) =>
              row.required_by_date
                ? new Date(row.required_by_date).toLocaleDateString()
                : "-",
          },
          {
            header: "Status",
            accessor: "status",
            render: (row) => (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                {row.status}
              </span>
            ),
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <Button
                title="Create RFQ"
                variant="primary"
                onClick={() =>
                  router.push(
                    `/dashboard/procurement/rfq-management/create?pr_id=${row.id}`
                  )
                }
              />
            ),
          },
        ]}
      />
    </div>
  );
}
