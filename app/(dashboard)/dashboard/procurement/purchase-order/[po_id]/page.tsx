"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  getPODetail,
  releasePO,
  cancelPO,
} from "@/services/purchaseorder.service";

export default function PODetailPage() {
  const { po_id } = useParams();
  const router = useRouter();
  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    if (!po_id) return;
    loadPO();
  }, [po_id]);

  const loadPO = async () => {
    const res = await getPODetail(po_id as string);
    setPo(res);
  };

  const handleRelease = async () => {
    await releasePO(po.id);
    loadPO();
  };

  const handleCancel = async () => {
    await cancelPO(po.id);
    loadPO();
  };

  if (!po) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">
            {po.po_number}
          </h1>
          <p className="text-sm text-gray-500">
            Vendor: {po.vendor_name}
          </p>
        </div>

        <span className="px-3 py-1 bg-gray-200 rounded text-sm">
          {po.status}
        </span>
      </div>

      <div className="bg-white border rounded p-4">
        <p><strong>PO Date:</strong> {new Date(po.po_date).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ₹ {po.total_amount}</p>
        <p><strong>Created:</strong> {new Date(po.created_at).toLocaleString()}</p>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2">Material</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Lead Time</th>
            </tr>
          </thead>
          <tbody>
            {po.items.map((item: any) => (
              <tr key={item.id}>
                <td className="border p-2">{item.material_name}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">₹ {item.rate}</td>
                <td className="border p-2">₹ {item.amount}</td>
                <td className="border p-2">{item.lead_time_days} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {po.status === "DRAFT" && (
        <div className="flex gap-4">
          <Button
            title="Release PO"
            variant="primary"
            onClick={handleRelease}
          />
          <Button
            title="Cancel PO"
            variant="danger"
            onClick={handleCancel}
          />
        </div>
      )}

    </div>
  );
}