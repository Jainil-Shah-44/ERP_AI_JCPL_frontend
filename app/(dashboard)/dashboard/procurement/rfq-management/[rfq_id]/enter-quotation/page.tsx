"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import {
  getRfqById,
  getRfqVendors,
  submitQuotation,
} from "@/services/rfq.service";

type RFQItem = {
  id: string;
  material_name: string;
  quantity: number;
};

type RFQVendor = {
  rfq_vendor_id: string;
  vendor_id: string;
  status: string;
};

type QuotationRow = {
  rfq_item_id: string;
  quoted_rate: string;
  lead_time_days: string;
  remarks: string;
};

export default function EnterQuotationPage() {
  const { rfq_id } = useParams();
  const router = useRouter();

  const [items, setItems] = useState<RFQItem[]>([]);
  const [vendors, setVendors] = useState<RFQVendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [quotationData, setQuotationData] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rfq_id) return;
    loadData();
  }, [rfq_id]);

  const loadData = async () => {
    try {
      const rfq = await getRfqById(rfq_id as string);
      const vendorList = await getRfqVendors(rfq_id as string);

      setItems(rfq.items || []);
      setVendors(vendorList || []);

      // Initialize quotation rows
      const initialRows = (rfq.items || []).map((item: any) => ({
        rfq_item_id: item.id,
        quoted_rate: "",
        lead_time_days: "",
        remarks: "",
      }));

      setQuotationData(initialRows);
    } catch (error) {
      console.error("Error loading RFQ data", error);
    }
  };

  const handleChange = (
    rfq_item_id: string,
    field: keyof QuotationRow,
    value: string
  ) => {
    setQuotationData((prev) =>
      prev.map((row) =>
        row.rfq_item_id === rfq_item_id
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedVendor) {
      alert("Please select vendor");
      return;
    }

    const invalid = quotationData.some(
      (row) => !row.quoted_rate || !row.lead_time_days
    );

    if (invalid) {
      alert("Please fill all quotation fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        rfq_vendor_id: selectedVendor,
        items: quotationData.map((row) => ({
          rfq_item_id: row.rfq_item_id,
          quoted_rate: Number(row.quoted_rate),
          lead_time_days: Number(row.lead_time_days),
          remarks: row.remarks || "",
        })),
      };

      await submitQuotation(payload);

      alert("Quotation Submitted Successfully");

      router.push(
        `/dashboard/procurement/rfq-management/${rfq_id}`
      );
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit quotation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">
        Enter Vendor Quotation
      </h1>

      {/* Vendor Selection */}
      <div className="space-y-2">
        <Label>Select Vendor</Label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map((v) => (
            <option
              key={v.rfq_vendor_id}
              value={v.rfq_vendor_id}
            >
              {v.vendor_id}
            </option>
          ))}
        </select>
      </div>

      {/* Items Table */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          RFQ Items
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 border">Material</th>
                <th className="px-3 py-2 border">Quantity</th>
                <th className="px-3 py-2 border">Quoted Rate</th>
                <th className="px-3 py-2 border">Lead Time (Days)</th>
                <th className="px-3 py-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const row = quotationData.find(
                  (r) => r.rfq_item_id === item.id
                );

                return (
                  <tr key={item.id}>
                    <td className="px-3 py-2 border">
                      {item.material_name}
                    </td>
                    <td className="px-3 py-2 border">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 border">
                      <input
                        type="number"
                        className="border rounded p-1 w-24"
                        value={row?.quoted_rate || ""}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "quoted_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      <input
                        type="number"
                        className="border rounded p-1 w-24"
                        value={row?.lead_time_days || ""}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "lead_time_days",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      <input
                        type="text"
                        className="border rounded p-1 w-40"
                        value={row?.remarks || ""}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "remarks",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
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