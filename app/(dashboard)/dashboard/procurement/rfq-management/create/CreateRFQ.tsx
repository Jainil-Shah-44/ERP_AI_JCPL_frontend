"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createRFQ } from "@/services/rfq.service";
import { getPurchaseRequisitionById } from "@/services/purchaserequisition.service";

import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

export default function CreateRFQ() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prId = searchParams.get("pr_id");

  const [items, setItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");
  const [warehouse, setWarehouse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ✅ Load PR Data
  useEffect(() => {
    if (!prId) return;

    const fetchPR = async () => {
      try {
        const data = await getPurchaseRequisitionById(prId);

        setItems(data.items || []);
        setWarehouse(data.warehouse_name || data.warehouse_id || "");
      } catch (error) {
        console.error("Failed to fetch PR:", error);
      }
    };

    fetchPR();
  }, [prId]);

  // ✅ Checkbox handler
  const handleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ✅ Submit
  const handleSubmit = async () => {
  if (!prId) {
    alert("PR ID not found");
    return;
  }

  if (selectedItems.length === 0) {
    alert("Please select at least one item");
    return;
  }

  try {
    setLoading(true);

    const res = await createRFQ({
      pr_id: prId,
      pr_item_ids: selectedItems,
      remarks,
    });

    // 🔥 Redirect to RFQ list
    router.push("/dashboard/procurement/rfq-management");

    // OR (Better ERP flow)
    // router.push(`/dashboard/procurement/rfq-management/${res.id}`);

  } catch (err) {
    console.error(err);
    alert("Error creating RFQ");
  } finally {
    setLoading(false);
  }
};

  return (
    <MasterFormLayout
      title="Create RFQ"
      description="Generate Request for Quotation from Purchase Requisition"
      actions={
        <Button
          title={loading ? "Creating..." : "Create RFQ"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || selectedItems.length === 0}
        />
      }
    >
      {/* PR Info Section */}
      <div className="md:col-span-2 space-y-1">
        <Label>Purchase Requisition ID</Label>
        <p className="text-sm text-gray-600">{prId}</p>
      </div>

      {/* <div className="md:col-span-2 space-y-1">
        <Label>Warehouse</Label>
        <p className="text-sm text-gray-600">{warehouse || "N/A"}</p>
      </div> */}

      {/* Items Table */}
      <div className="md:col-span-2 mt-4">
        <Label className="mb-2 block">PR Items</Label>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left w-16">Select</th>
                <th className="px-4 py-2 text-left">Material</th>
                <th className="px-4 py-2 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-400"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      {item.material_name || item.material_id}
                    </td>
                    <td className="px-4 py-2">
                      {item.requested_qty}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remarks */}
      <div className="md:col-span-2 mt-4">
        <Label>Remarks</Label>
        <textarea
          className="w-full border rounded p-2 mt-1"
          placeholder="Enter remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>
    </MasterFormLayout>
  );
}
