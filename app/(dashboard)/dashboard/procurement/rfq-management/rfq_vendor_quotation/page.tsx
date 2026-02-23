"use client";

import Table from "@/components/ui/Table";
import type { Column } from "@/components/ui/Table";
import { useEffect, useState } from "react";

export type RfqSupplier = {
    supplier: string;
    price: number;
    leadTime: string;
    paymentTerms: string;
    aiScore: number;
};

const columns: Column<RfqSupplier>[] = [
    { label: "Supplier", key: "supplier" },
    {
        label: "Price",
        key: "price",
        render: (row) => `₹${row.price.toLocaleString()}`,
    },
    { label: "Lead Time", key: "leadTime" },
    { label: "Payment Terms", key: "paymentTerms" },
    {
        label: "AI Score",
        key: "aiScore",
        render: (row) => (
            <span className="text-yellow-500">
                {"★".repeat(row.aiScore)}{"☆".repeat(5 - row.aiScore)}
            </span>
        ),
    },
];

const data: RfqSupplier[] = [
    {
        supplier: "Supplier A",
        price: 12500,
        leadTime: "5 days",
        paymentTerms: "Net 30",
        aiScore: 4,
    },
    {
        supplier: "Supplier B",
        price: 12800,
        leadTime: "8 days",
        paymentTerms: "Net 45",
        aiScore: 3,
    },
];

export default function RfqManagementPage() {

     const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const handleSelect = (row: RfqSupplier) => {
        console.log("Selected Supplier:", row);
    };

     useEffect(() => {
    const fetchRFQ = async () => {
      try {
        const res = await fetch("http://localhost:8000/rfq/?page=1&limit=20");

        if (!res.ok) {
          throw new Error("Failed to fetch RFQ data");
        }

        const result = await res.json();
        console.log("RFQ API Response:", result);

        setRes(result);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRFQ();
  }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-1">RFQ Management</h1>
            <p className="text-sm text-gray-500 mb-4">
                Compare supplier quotes and select the best option
            </p>
            {/* ===== Table Box ===== */}
            <div className="rounded-lg border border-gray-300 bg-white p-4">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    RFQ Comparison Table
                </h2>
                <Table
                    columns={columns}
                    data={data}
                    onAction={handleSelect}
                />

            </div>

            {/* ===== AI Recommendation Box (SAME PAGE) ===== */}
            <div className="mt-4 rounded-lg border border-gray-300 bg-white p-5">
                <div className="flex gap-4">

                    {/* Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-600 text-white">
                        💡
                    </div>

                    {/* Text */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            AI Recommendation
                        </h3>

                        <p className="mt-1 text-sm text-gray-700">
                            <strong>Supplier A</strong> is recommended based on AI analysis:
                        </p>

                        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                            <li>98% on-time delivery</li>
                            <li>Lowest rejection rate</li>
                            <li>Best price vs quality balance</li>
                            <li>Reliable past performance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}



