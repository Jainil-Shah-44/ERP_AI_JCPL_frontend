"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  getPODetail,
  releasePO,
  cancelPO,
} from "@/services/purchaseorder.service";

export default function PODetailPage() {
  const { po_id } = useParams();
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

      {/* HEADER */}
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

      {/* BASIC INFO */}
      <div className="bg-white border rounded p-4 grid grid-cols-2 gap-4">
        <p><strong>PO Date:</strong> {new Date(po.po_date).toLocaleDateString()}</p>
        <p><strong>Created:</strong> {new Date(po.created_at).toLocaleString()}</p>
        <p><strong>Total:</strong> ₹ {po.total_amount}</p>
      </div>

      {/* VENDOR + LOGISTICS */}
      <div className="bg-white border rounded p-4 grid grid-cols-2 gap-4">
        <div>
          <p><strong>Vendor Address:</strong></p>
          <p>{po.vendor_address || "-"}</p>

          <p className="mt-2"><strong>Contact:</strong> {po.vendor_contact || "-"}</p>
        </div>

        <div>
          <p><strong>Transporter:</strong> {po.transporter || "-"}</p>
          <p><strong>Payment Terms:</strong> {po.payment_terms || "-"}</p>
          <p><strong>Delivery Terms:</strong> {po.delivery_terms || "-"}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2">Material</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Weight</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {po.items.map((item: any) => (
              <tr key={item.id}>
                <td className="border p-2">{item.material_name}</td>
                <td className="border p-2">{item.description || "-"}</td>
                <td className="border p-2">{item.hsn_code || "-"}</td>
                <td className="border p-2">{item.weight || "-"}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">₹ {item.rate}</td>
                <td className="border p-2">₹ {item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TAX SUMMARY */}
      <div className="bg-white border rounded p-4 text-right space-y-1">
        <p>SGST ({po.sgst_percent}%): ₹ {po.sgst_amount}</p>
        <p>CGST ({po.cgst_percent}%): ₹ {po.cgst_amount}</p>
        <p className="font-bold text-lg">Total: ₹ {po.total_amount}</p>
      </div>

      {/* INSTRUCTIONS */}
      <div className="bg-white border rounded p-4">
        <p><strong>Instructions:</strong></p>
        <p>{po.other_instructions || "-"}</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 flex-wrap">

        <Button
          title="Download PDF"
          variant="secondary"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/purchase-order/${po.id}/pdf`,
              "_blank"
            )
          }
        />

        {po.status === "DRAFT" && (
          <>
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
          </>
        )}

      </div>

    </div>
  );
}