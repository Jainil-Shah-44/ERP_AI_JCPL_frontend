"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPurchaseRequisitionById } from "@/services/purchaserequisition.service";

export default function ViewPRPage() {
  const { id } = useParams();

  const [pr, setPr] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getPurchaseRequisitionById(id as string);
        setPr(data);
      } catch (error) {
        console.error("Failed to fetch PR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading PR...</div>;
  }

  if (!pr) {
    return <div className="p-6 text-red-500">PR not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        View PR Details
      </h1>

      {/* HEADER INFO */}
      <div className="bg-white border rounded p-4 space-y-2">
        <p><strong>PR Number:</strong> {pr.pr_number}</p>
        <p><strong>Status:</strong> {pr.status}</p>
        <p><strong>Factory:</strong> {pr.factory_name}</p>
        <p><strong>Warehouse:</strong> {pr.warehouse_name}</p>
        <p><strong>Department:</strong> {pr.department}</p>
        <p><strong>Priority:</strong> {pr.priority}</p>
        <p><strong>Remarks:</strong> {pr.remarks || "-"}</p>
        <p><strong>Created At:</strong> {new Date(pr.created_at).toLocaleString()}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Items</h2>

        {pr.items.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="border px-3 py-2">Material Code</th> */}
                <th className="border px-3 py-2">Material Name</th>
                <th className="border px-3 py-2">Quantity</th>
                <th className="border px-3 py-2">Unit</th>
                <th className="border px-3 py-2">Estimated Rate</th>
                <th className="border px-3 py-2">Required Date</th>
              </tr>
            </thead>
            <tbody>
              {pr.items.map((item: any) => (
                <tr key={item.id}>
                  {/* <td className="border px-3 py-2">{item.material_code}</td> */}
                  <td className="border px-3 py-2">{item.material_name}</td>
                  <td className="border px-3 py-2">{item.requested_qty}</td>
                  <td className="border px-3 py-2">{item.unit_name || "-"}</td>
                  <td className="border px-3 py-2">{item.estimated_rate}</td>
                  <td className="border px-3 py-2">
                    {item.required_by_date || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ATTACHMENTS */}
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">
          Attachments
        </h2>

        {pr.attachments.length === 0 ? (
          <p className="text-gray-500">No attachments</p>
        ) : (
          pr.attachments.map((file: any) => {
            const baseURL =
              process.env.NEXT_PUBLIC_API_URL
            //   || "http://localhost:8000";

            const path = file.file_path?.startsWith("/")
              ? file.file_path
              : `/${file.file_path}`;

            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

            const BASE_URL = API_URL.replace("/api", "");

            const fullUrl = `${BASE_URL}/uploads/${file.file_path}`;

            return (
              <div key={file.id} className="mb-2">
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.file_name}
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}