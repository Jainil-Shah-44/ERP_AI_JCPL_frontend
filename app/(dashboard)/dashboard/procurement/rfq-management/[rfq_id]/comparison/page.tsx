"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { getRfqComparison } from "@/services/rfq.service";
import { createPOFromRFQ } from "@/services/rfq.service";
import { useRouter } from "next/navigation";



type VendorQuote = {
  rfq_vendor_id: string;
  vendor_id: string;
  vendor_name: string;
  quoted_rate: number;
  lead_time_days: number;
};

type ComparisonItem = {
  rfq_item_id: string;
  material_name: string;
  quantity: number;
  quotations: VendorQuote[];
};

export default function RFQComparisonPage() {
  const { rfq_id } = useParams();
  const router = useRouter();

  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [selection, setSelection] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!rfq_id) return;
    loadComparison();
  }, [rfq_id]);

  const loadComparison = async () => {
    const res = await getRfqComparison(rfq_id as string);
    const data = res.items || [];

    setItems(data);

    const vendorSet = new Set<string>();
    data.forEach((item: ComparisonItem) => {
      item.quotations.forEach((q) =>
        vendorSet.add(q.vendor_name)
      );
    });

    setVendors(Array.from(vendorSet));
  };

  const getLowestRate = (quotes: VendorQuote[]) => {
    if (!quotes?.length) return null;
    return Math.min(...quotes.map((q) => q.quoted_rate));
  };

  const handleSelect = (itemId: string, rfqVendorId: string) => {
    setSelection((prev) => ({
      ...prev,
      [itemId]: rfqVendorId,
    }));
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">
        RFQ Comparison
      </h1>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Material</th>
              <th className="border p-2">Qty</th>

              {vendors.map((vendor) => (
                <th key={vendor} className="border p-2">
                  {vendor}
                </th>
              ))}

              <th className="border p-2">Select Vendor</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const lowest = getLowestRate(item.quotations);

              return (
                <tr key={item.rfq_item_id}>
                  <td className="border p-2">
                    {item.material_name}
                  </td>

                  <td className="border p-2">
                    {item.quantity}
                  </td>

                  {vendors.map((vendor) => {
                    const quote = item.quotations.find(
                      (q) => q.vendor_name === vendor
                    );

                    if (!quote) {
                      return (
                        <td key={vendor} className="border p-2 text-gray-400">
                          —
                        </td>
                      );
                    }

                    const isLowest =
                      quote.quoted_rate === lowest;

                    return (
                      <td
                        key={vendor}
                        className={`border p-2 ${
                          isLowest
                            ? "bg-green-50"
                            : ""
                        }`}
                      >
                        <div>
                          ₹ {quote.quoted_rate}
                        </div>
                        <div className="text-xs text-gray-500">
                          {quote.lead_time_days} days
                        </div>
                      </td>
                    );
                  })}

                  <td className="border p-2">
                    <Select
                      name={`select-${item.rfq_item_id}`}
                      value={selection[item.rfq_item_id] || ""}
                      options={item.quotations.map((q) => ({
                        label: q.vendor_name,
                        value: q.rfq_vendor_id,
                      }))}
                      onChange={(e: any) =>
                        handleSelect(
                          item.rfq_item_id,
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

      <div className="flex justify-end">
        <Button
            title="Create Purchase Orders"
            onClick={async () => {
                if (items.length === 0) {
                alert("No items found");
                return;
                }

                if (Object.keys(selection).length !== items.length) {
                alert("Please select vendor for all items");
                return;
                }

                try {
                const payload = {
                    rfq_id: rfq_id as string,
                    selections: items.map((item) => {
                    const selectedVendorId =
                        selection[item.rfq_item_id];

                    const selectedQuote =
                        item.quotations.find(
                        (q) =>
                            q.rfq_vendor_id === selectedVendorId
                        );

                    if (!selectedQuote) {
                        throw new Error("Invalid selection");
                    }

                    return {
                        rfq_item_id: item.rfq_item_id,
                        rfq_vendor_id:
                        selectedQuote.rfq_vendor_id,
                        final_rate:
                        selectedQuote.quoted_rate,
                        lead_time_days:
                        selectedQuote.lead_time_days,
                    };
                    }),
                };

                await createPOFromRFQ(payload);

                alert("PO Created Successfully");

                router.push(
                    "/dashboard/procurement/purchase-order"
                );

                } catch (error: any) {
                alert(error.message || "PO Creation Failed");
                }
            }}
            />
      </div>

    </div>
  );
}