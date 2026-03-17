"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DataTable from "@/components/layout/DataTable";
import { useRouter } from "next/navigation";

import {
  approvePurchaseRequisition,
  getPurchaseRequisitionAttachments,
  getPurchaseRequisitions,
  rejectPurchaseRequisition,
} from "@/services/purchaserequisition.service";
import { hasPermission } from "@/lib/permissions";

export default function PurchaseRequisitionListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] =
    useState<"APPROVE" | "REJECT" | null>(null);
  const [selectedPR, setSelectedPR] = useState<any>(null);
  const [remarks, setRemarks] = useState("");

  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const router = useRouter();

  /* ================= LOAD ================= */

  const load = async () => {
    const res = await getPurchaseRequisitions(1, 20);
    setItems(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= APPROVE / REJECT ================= */

  const handleConfirmAction = async () => {
    if (!selectedPR || !actionType) return;

    if (!remarks.trim()) {
      alert("Remarks is required");
      return;
    }

    try {
      if (actionType === "APPROVE") {
        await approvePurchaseRequisition(selectedPR.id, remarks);
      } else {
        await rejectPurchaseRequisition(selectedPR.id, remarks);
      }

      setShowModal(false);
      setRemarks("");
      setSelectedPR(null);
      load();
    } catch (error) {
      alert("Action Failed ❌");
    }
  };

  /* ================= VIEW DOCS ================= */

  const handleViewDocs = async (id: string) => {
    try {
      setLoadingDocs(true);

      const res = await getPurchaseRequisitionAttachments(id);

      setSelectedDocs(res?.data || res || []);
      setShowDocsModal(true);
    } catch (error) {
      alert("Failed to load documents ❌");
    } finally {
      setLoadingDocs(false);
    }
  };

  /* ================= STATUS BADGE ================= */

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-xs font-medium";

    if (status === "DRAFT")
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>DRAFT</span>;

    if (status === "SUBMITTED")
      return <span className={`${base} bg-blue-100 text-blue-700`}>SUBMITTED</span>;

    if (status === "APPROVED")
      return <span className={`${base} bg-green-100 text-green-700`}>APPROVED</span>;

    if (status === "REJECTED")
      return <span className={`${base} bg-red-100 text-red-700`}>REJECTED</span>;

    return <span className={base}>{status}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Purchase Requisition
        </h1>

        {hasPermission("PR_CREATE") && (
  <Link href="/dashboard/procurement/purchase-requisition/create">
    <Button title="Create PR" />
  </Link>
)}
      </div>

      {/* TABLE */}
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
            header: "Status",
            accessor: "status",
            render: (row) => getStatusBadge(row.status),
          },
          {
            header: "View PR",
            accessor: "id",
            render: (row) => (
              <Button
                title="View"
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/dashboard/procurement/purchase-requisition/view/${row.id}`
                  )
                }
              />
            ),
          },
          {
            header: "View Docs",
            accessor: "id",
            render: (row) => (
              <Button
                title="Docs"
                variant="secondary"
                onClick={() => handleViewDocs(row.id)}
              />
            ),
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => {
              if (row.status === "SUBMITTED" && hasPermission("PR_APPROVE")) {
                return (
                  <div className="flex gap-2">
                    <Button
                      title="Approve"
                      variant="secondary"
                      onClick={() => {
                        setSelectedPR(row);
                        setActionType("APPROVE");
                        setShowModal(true);
                      }}
                    />
                    <Button
                      title="Reject"
                      variant="danger"
                      onClick={() => {
                        setSelectedPR(row);
                        setActionType("REJECT");
                        setShowModal(true);
                      }}
                    />
                  </div>
                );
              }

              if (row.status === "DRAFT" && hasPermission("PR_EDIT")) {
                return (
                  <Button
                    title="Edit"
                    variant="secondary"
                    onClick={() =>
                      router.push(
                        `/dashboard/procurement/purchase-requisition/${row.id}`
                      )
                    }
                  />
                );
              }

              if (row.status === "APPROVED" && hasPermission("RFQ_CREATE")) {
                return (
                  <Button
                    title="Create RFQ"
                    variant="primary"
                    onClick={() =>
                      router.push(
                        `/dashboard/procurement/rfq-management/create?pr_id=${row.id}`
                      )
                    }
                  />
                );
              }

              return null;
            },
          },
        ]}
      />

      {/* APPROVE/REJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {actionType === "APPROVE"
                ? "Approve Purchase Requisition"
                : "Reject Purchase Requisition"}
            </h2>

            <div className="mb-4">
              <label className="text-sm font-medium">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter remarks"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                title="Cancel"
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  setRemarks("");
                }}
              />
              <Button
                title="Confirm"
                variant="primary"
                onClick={handleConfirmAction}
              />
            </div>
          </div>
        </div>
      )}

      {/* DOCS MODAL */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] p-6 shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Attachments
            </h2>

            {loadingDocs ? (
              <p>Loading...</p>
            ) : selectedDocs.length === 0 ? (
              <p>No attachments found.</p>
            ) : (
              selectedDocs.map((doc: any) => {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

                // remove /api
                const BASE_URL = API_URL.replace("/api", "");

                const fullUrl = `${BASE_URL}/uploads/${doc.file_path}`;
                
                return (
                  <div key={doc.id} className="mb-3">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.file_name}
                    </a>
                  </div>
                );
              })
            )}

            <div className="flex justify-end mt-4">
              <Button
                title="Close"
                onClick={() => setShowDocsModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}