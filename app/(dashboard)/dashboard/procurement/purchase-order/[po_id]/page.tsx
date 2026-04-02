"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  getPODetail,
  releasePO,
  cancelPO,
} from "@/services/purchaseorder.service";

const COMPANY_GSTIN = "24AABCJ5069J1ZG";

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
      <div className="flex justify-between items-center border-b pb-2">
        <div>
          <h1 className="text-xl font-semibold">{po.po_number}</h1>
          <p className="text-sm text-gray-500">{po.vendor_name}</p>
        </div>

        <span className="px-3 py-1 bg-gray-200 rounded text-sm">
          {po.status}
        </span>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-2 gap-4">
        {/* VENDOR */}
        <div className="bg-white border rounded p-4">
          <p className="font-semibold mb-2">Vendor</p>
          <p>{po.vendor_name}</p>
          <p>{po.vendor_address_line1 || "-"}</p>
          <p>{po.vendor_address_line2 || "-"}</p>
        </div>

        {/* PO DETAILS */}
        <div className="bg-white border rounded p-4">
          <p>
            <strong>Plot No:</strong> {po.factory_name || "-"}
          </p>
          <p>
            <strong>P.No:</strong> {po.plot_no}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(po.po_date).toLocaleDateString("en-GB")}
          </p>
          <p>
            <strong>Transporter:</strong> {po.transporter || "-"}
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Specification</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Value</th>
            </tr>
          </thead>

          <tbody>
            {po.items.map((item: any, index: number) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.material_name}</td>
                <td className="border p-2">{item.description || "-"}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-right">₹ {item.rate}</td>
                <td className="border p-2 text-right">₹ {item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TAX SUMMARY */}
      <div className="bg-white border rounded p-4 text-right space-y-1">
        {po.tax_type === "IGST" ? (
          <p>
            IGST ({po.igst_percent}%): ₹ {po.igst_amount}
          </p>
        ) : (
          <>
            <p>
              SGST ({po.sgst_percent}%): ₹ {po.sgst_amount}
            </p>
            <p>
              CGST ({po.cgst_percent}%): ₹ {po.cgst_amount}
            </p>
          </>
        )}

        <p className="font-bold text-lg">Total: ₹ {po.total_amount}</p>
      </div>
      {/* FOOTER SECTION */}
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT */}
        <div className="bg-white border rounded p-4">
          <p>
            <strong>Payment Terms:</strong> {po.payment_terms || "-"}
          </p>
          <p>
            <strong>Range:</strong> {po.factory_range || "-"}
          </p>
          <p>
            <strong>Division:</strong> {po.factory_division || "-"}
          </p>
          <p>
            <strong>Commissionerate:</strong>{" "}
            {po.factory_commissionerate || "-"}
          </p>
          <p>
            <strong>GSTIN:</strong> {COMPANY_GSTIN}
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded p-4">
          <p className="font-semibold">Other Instructions</p>
          <p className="whitespace-pre-line">{po.other_instructions || "-"}</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 flex-wrap">
        <Button
          title="Download PDF"
          variant="secondary"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_API_URL}/purchase-order/${po.id}/pdf`,
              "_blank",
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
            <Button title="Cancel PO" variant="danger" onClick={handleCancel} />
          </>
        )}
      </div>
    </div>
  );
}
