"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import DataTable from "@/components/layout/DataTable";
import { getRfqById, submitQuotation } from "@/services/rfq.service";
import { Column } from "@/components/layout/DataTable";

type QuotationItem = {
  id: string;
  material_name: string;
  quantity: number;
  quoted_rate: string;
  lead_time_days: string;
  remarks: string;
};

export default function VendorQuotationPage() {
  const params = useParams();
const rfq_id = params.rfq_id as string;
const rfq_vendor_id = params.rfq_vendor_id as string;
  const router = useRouter();

  const [items, setItems] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rfq_id) return;

    loadRFQItems();
  }, [rfq_id]);

  const loadRFQItems = async () => {
    try {
      const rfqData = await getRfqById(rfq_id as string);

      const mapped = (rfqData.items || []).map((item: any) => ({
        id: item.id,
        material_name: item.material_name,
        quantity: item.quantity,
        quoted_rate: "",
        lead_time_days: "",
        remarks: "",
      }));

      setItems(mapped);
    } catch (error) {
      console.error("Failed to load RFQ items", error);
    }
  };

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
    if (!rfq_vendor_id) return;

    try {
      setLoading(true);

      const payload = {
        rfq_vendor_id,
        items: items.map((item) => ({
          rfq_item_id: item.id,
          quoted_rate: Number(item.quoted_rate || 0),
          lead_time_days: Number(item.lead_time_days || 0),
          remarks: item.remarks || "",
        })),
      };

      await submitQuotation(payload);

      router.push(
        `/dashboard/procurement/rfq-management/${rfq_id}`
      );

    } catch (error) {
      console.error("Quotation submission failed", error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<QuotationItem>[] = [
    { header: "Material", accessor: "material_name" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Quoted Rate",
      accessor: "quoted_rate",
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
      accessor: "lead_time_days",
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
      accessor: "remarks",
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
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">
        Vendor Quotation
      </h1>

      <DataTable data={items} columns={columns} />

      <div className="flex gap-3">
        <Button
          title={loading ? "Submitting..." : "Submit Quotation"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        />

        <Button
          title="Cancel"
          variant="secondary"
          onClick={() =>
            router.push(
              `/dashboard/procurement/rfq-management/${rfq_id}`
            )
          }
        />
      </div>

    </div>
  );
}