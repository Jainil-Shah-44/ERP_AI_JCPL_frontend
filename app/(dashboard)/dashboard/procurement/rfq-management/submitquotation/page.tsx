"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import DataTable from "@/components/layout/DataTable";
import { getRfqById, getRfqVendors, submitQuotation } from "@/services/rfq.service";

type QuotationItem = {
    id: string;
    material_name: string;
    quantity: number;
    quoted_rate: string;
    lead_time_days: string;
    remarks: string;
};

export default function SubmitQuotationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const rfqId = "a3c28510-34ee-4155-9822-cec40afa01bc";
    // const rfqVendorId = "0d6a8e54-88e9-4697-bcfe-405458cff00f"; // 🔥 hardcoded for now

    const [items, setItems] = useState<QuotationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [rfqVendorId, setRfqVendorId] = useState<string | null>(null);

    // useEffect(() => {
    //     if (!rfqId) return;

    //     const fetchRFQItems = async () => {
    //         const data = await getRfqById(rfqId);

    //         const mapped: QuotationItem[] = (data.items || []).map(
    //             (item: any) => ({
    //                 id: item.id,
    //                 material_name: item.material_name,
    //                 quantity: item.quantity,
    //                 quoted_rate: "",
    //                 lead_time_days: "",
    //                 remarks: "",
    //             })
    //         );

    //         setItems(mapped);
    //     };

    //     fetchRFQItems();
    // }, [rfqId]);

    // ✅ ID based update

    useEffect(() => {
        if (!rfqId) return;

        const fetchData = async () => {
            try {
                const rfqData = await getRfqById(rfqId);

                const mapped = (rfqData.items || []).map((item: any) => ({
                    id: item.id,
                    material_name: item.material_name,
                    quantity: item.quantity,
                    quoted_rate: "",
                    lead_time_days: "",
                    remarks: "",
                }));

                setItems(mapped);

                const vendors = await getRfqVendors(rfqId);

                if (vendors?.length) {
                    setRfqVendorId(vendors[0].rfq_vendor_id);
                }

            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, [rfqId]);

    const handleChange = (
        id: string,
        field: keyof QuotationItem,
        value: string
    ) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSubmit = async () => {
        if (!rfqVendorId) {
            alert("RFQ Vendor not found");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                rfq_vendor_id: rfqVendorId,
                items: items.map((item) => ({
                    rfq_item_id: item.id,
                    quoted_rate: Number(item.quoted_rate || 0),
                    lead_time_days: Number(item.lead_time_days || 0),
                    remarks: item.remarks || "",
                })),
            };

            await submitQuotation(rfqId, payload);

            alert("Quotation Submitted Successfully");

        } catch (error) {
            console.error("Submit Error:", error);
            alert("Submission Failed");
        } finally {
            setLoading(false);
        }
    };

    // const handleSubmit = async () => {
    //     try {
    //         setLoading(true);

    //         const payload = {
    //             rfq_vendor_id: rfqVendorId,
    //             items: items.map((item) => ({
    //                 rfq_item_id: item.id,
    //                 quoted_rate: Number(item.quoted_rate || 0),
    //                 lead_time_days: Number(item.lead_time_days || 0),
    //                 remarks: item.remarks || "",
    //             })),
    //         };

    //         console.log("Submitting Payload:", payload);

    //         await submitQuotation(rfqId, payload);

    //         alert("Quotation Submitted Successfully");
    //         // router.push("/vendor/dashboard");

    //     } catch (error) {
    //         console.error("Submit Error:", error);
    //         alert("Submission Failed");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const columns = [
        {
            header: "Material",
            accessor: "material_name" as keyof QuotationItem,
        },
        {
            header: "Quantity",
            accessor: "quantity" as keyof QuotationItem,
        },
        {
            header: "Quoted Rate",
            accessor: "quoted_rate" as keyof QuotationItem,
            render: (row: QuotationItem) => (
                <input
                    type="number"
                    className="border rounded p-1 w-24"
                    value={row.quoted_rate}
                    onChange={(e) =>
                        handleChange(row.id, "quoted_rate", e.target.value)
                    }
                />
            ),
        },
        {
            header: "Lead Time (Days)",
            accessor: "lead_time_days" as keyof QuotationItem,
            render: (row: QuotationItem) => (
                <input
                    type="number"
                    className="border rounded p-1 w-24"
                    value={row.lead_time_days}
                    onChange={(e) =>
                        handleChange(row.id, "lead_time_days", e.target.value)
                    }
                />
            ),
        },
        {
            header: "Remarks",
            accessor: "remarks" as keyof QuotationItem,
            render: (row: QuotationItem) => (
                <input
                    type="text"
                    className="border rounded p-1 w-40"
                    value={row.remarks}
                    onChange={(e) =>
                        handleChange(row.id, "remarks", e.target.value)
                    }
                />
            ),
        },
    ];

    return (
        <MasterFormLayout
            title="Submit Quotation"
            description="Fill quotation details for RFQ items"
            actions={
                <Button
                    title={loading ? "Submitting..." : "Submit Quotation"}
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                />
            }
        >
            <div className="md:col-span-2 space-y-1">
                <Label>RFQ ID</Label>
                <p className="text-sm text-gray-600">{rfqId}</p>
            </div>

            <div className="md:col-span-2 mt-4">
                <Label className="mb-2 block">Items</Label>
                <DataTable data={items} columns={columns} />
            </div>
        </MasterFormLayout>
    );
}