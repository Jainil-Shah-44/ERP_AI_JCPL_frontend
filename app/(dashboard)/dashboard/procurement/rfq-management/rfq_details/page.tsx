"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/layout/DataTable";
import Button from "@/components/ui/Button";
import { getRFQs } from "@/services/rfq.service";

export default function RFQDetailsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const router = useRouter();
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);

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

  useEffect(() => {
    loadRFQs();
  }, []);

  const handleSendRFQ = async (id: string) => {
    try {
      setSendingId(id);

      // 🔥 call your backend API here
      await fetch(`/api/rfq/${id}/send`, {
        method: "POST",
      });

      alert("RFQ Sent Successfully");

      loadRFQs(); // refresh table
    } catch (error) {
      console.error("Failed to send RFQ", error);
      alert("Error sending RFQ");
    } finally {
      setSendingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "DRAFT") {
      return (
        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
          DRAFT
        </span>
      );
    }

    if (status === "SENT") {
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
          SENT
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">RFQ List</h1>

      <DataTable
        data={rfqs}
        pageSize={5}
        columns={[
          {
            header: "RFQ Number",
            accessor: "rfq_number",
            sortable: true,
          },
          {
            header: "PR ID",
            accessor: "pr_id",
            sortable: true,
          },
          {
            header: "Created Date",
            accessor: "created_at",
            sortable: true,
            render: (row) =>
              row.created_at
                ? new Date(row.created_at).toLocaleDateString()
                : "-",
          },
          {
            header: "Status",
            accessor: "status",
            render: (row) => getStatusBadge(row.status),
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">

                {row.status === "DRAFT" && (
                  <Button
                    title="Invite Vendors"
                    variant="primary"
                    onClick={() =>
                      router.push(
                        `/dashboard/procurement/rfq-management/invite_vendor?rfq_id=${row.id}`
                      )
                    }
                  />
                )}

                {row.status === "CLOSED" && (
                  <Button
                    title="Done"
                    variant="secondary"
                    disabled
                  />
                )}
              </div>
            ),
          }
        ]}
      />

      {loading && (
        <p className="text-sm text-gray-500">
          Loading RFQs...
        </p>
      )}
    </div>
  );
}
