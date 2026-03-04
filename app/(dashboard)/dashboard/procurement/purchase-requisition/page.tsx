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

export default function PurchaseRequisitionListPage() {
    const [items, setItems] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);
    const [selectedPR, setSelectedPR] = useState<any>(null);
    const [remarks, setRemarks] = useState("");
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<any[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const router = useRouter();

    const load = async () => {
        const res = await getPurchaseRequisitions(1, 20);

        // backend pagination structure handle
        setItems(res.data || []);
        console.log(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const handleConfirmAction = async () => {
        if (!selectedPR || !actionType) return;

        // ✅ Mandatory validation
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

    const handleViewDocs = async (id: string) => {
        try {
            setLoadingDocs(true);

            const res = await getPurchaseRequisitionAttachments(id);

            // backend response structure check kara
            setSelectedDocs(res?.data || res || []);

            setShowDocsModal(true);

        } catch (error) {
            alert("Failed to load documents ❌");
        } finally {
            setLoadingDocs(false);
        }
    };




    return (
        <div className="p-6 space-y-4">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">
                    Purchase Requisition
                </h1>

                <Link href="/dashboard/procurement/purchase-requisition/create">
                    <Button title="Create PR" />
                </Link>
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
                        header: "Status",
                        accessor: "status",
                        sortable: true,
                        render: (row) => (
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${row.status === "DRAFT"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : row.status === "SUBMITTED"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {row.status}
                            </span>
                        ),
                    },
                    // {
                    //     header: "Required Date",
                    //     accessor: "required_by_date",
                    //     sortable: true,
                    // },
                    {
                        header: "View Docs",
                        accessor: "id",
                        render: (row) => (
                            <Button
                                title="View"
                                variant="secondary"
                                onClick={() => handleViewDocs(row.id)}
                            />
                        ),
                    },

                    {
                        header: "Actions",
                        accessor: "id",
                        render: (row) => {
                            if (row.status === "SUBMITTED") {
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

                            if (row.status === "DRAFT") {
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


                            if (row.status === "APPROVED") {
                                return (
                                    <div className="flex gap-2">
                                        <Button
                                            title="Approved"
                                            variant="secondary"
                                            disabled
                                        />

                                        <Button
                                            title="Create RFQ"
                                            variant="primary"
                                            onClick={() =>
                                                router.push(
                                            `/dashboard/procurement/rfq-management/create?pr_id=${row.id}`
                                            )
                                            }
                                        />
                                    </div>
                                );
                            }

                            if (row.status === "REJECTED") {
                                return (
                                    <Button
                                        title="Rejected"
                                        variant="danger"
                                        disabled
                                    />
                                );
                            }

                            return null;
                        },
                    }


                ]}
            />
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">

                        <h2 className="text-lg font-semibold mb-4">
                            {actionType === "APPROVE"
                                ? "Approve Purchase Requisition"
                                : "Reject Purchase Requisition"}
                        </h2>

                        <div className="mb-3">
                            <label className="text-sm font-medium">PR Number</label>
                            <input
                                type="text"
                                value={selectedPR?.pr_number}
                                readOnly
                                className="w-full border rounded px-3 py-2 bg-gray-100"
                            />
                        </div>

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
                                title={
                                    actionType === "APPROVE"
                                        ? "Confirm Approve"
                                        : "Confirm Reject"
                                }
                                variant={actionType === "APPROVE" ? "secondary" : "danger"}
                                onClick={handleConfirmAction}
                            />
                        </div>
                    </div>
                </div>
            )}

            {selectedDocs.map((doc: any, index: number) => {

                const fullUrl = doc.file_url?.startsWith("http")
                    ? doc.file_url
                    : `http://localhost:8000${doc.file_url}`;

                return (
                    <div key={index} className="border p-3 rounded mb-3">

                        <p className="text-sm font-medium mb-2">
                            {doc.file_name}
                        </p>

                        {/* Image */}
                        <img
                            src={fullUrl}
                            alt={doc.file_name}
                            className="w-full max-h-[300px] object-contain border rounded"
                        />

                    </div>
                );
            })}

        </div>
    );
}
