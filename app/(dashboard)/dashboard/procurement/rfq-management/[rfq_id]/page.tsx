"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  getRfqById,
  getRfqVendors,
  removeVendorFromRFQ,
  sendRFQEmails,
} from "@/services/rfq.service";


type RFQItem = {
  id: string;
  material_code: string;
  material_name: string;
  material_specification: string;
  material_description: string;
  quantity: number;
};

type RFQVendor = {
  rfq_vendor_id: string;
  vendor_id: string;
  status: string;
  vendor_name: string;
  invited_at: string;
  responded_at: string | null;
};

type RFQAttachment = {
  id: string;
  file_name: string;
  file_path: string;
};

type RFQ = {
  id: string;
  rfq_number: string;
  rfq_date: string;
  status: string;
  source_pr_id: string;
  source_pr_number: string;
  remarks: string;
  created_at: string;
  items: RFQItem[];
  attachments: RFQAttachment[];
};


export default function RFQDetailPage() {
  const { rfq_id } = useParams();
  const router = useRouter();

  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [vendors, setVendors] = useState<RFQVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:8000";

  useEffect(() => {
    if (!rfq_id) return;
    loadData();
  }, [rfq_id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const rfqData = await getRfqById(rfq_id as string);
      const vendorData = await getRfqVendors(rfq_id as string);

      setRfq(rfqData);
      setVendors(vendorData || []);
    } catch (error) {
      console.error("Failed to load RFQ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = useCallback(async () => {
    if (!rfq_id) return;

    try {
      const res = await getRfqVendors(rfq_id as string);
      console.log("FETCHED VENDORS:", res);
      setVendors(res || []);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  }, [rfq_id]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    if (rfq_id) {
      fetchVendors();
    }
  }, [rfq_id]);

  useEffect(() => {
    const handleFocus = () => {
      fetchVendors(); // 🔥 reload when user comes back
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchVendors]);

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 text-xs rounded font-medium";

    if (status === "DRAFT")
      return <span className={`${base} bg-gray-200 text-gray-700`}>DRAFT</span>;

    if (status === "SENT")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>SENT</span>
      );

    if (status === "CLOSED")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>CLOSED</span>
      );

    if (status === "CANCELLED")
      return (
        <span className={`${base} bg-red-100 text-red-700`}>CANCELLED</span>
      );

    return <span className={base}>{status}</span>;
  };

  if (loading) {
    return <div className="p-6">Loading RFQ...</div>;
  }

  if (!rfq) {
    return <div className="p-6">RFQ not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">{rfq.rfq_number}</h1>
          <p className="text-sm text-gray-500">
            RFQ Date:{" "}
            {rfq.rfq_date
              ? new Date(rfq.rfq_date).toLocaleDateString("en-GB")
              : "-"}
          </p>
        </div>

        {getStatusBadge(rfq.status)}
      </div>

      {/* RFQ Meta Info */}
      <div className="bg-white border rounded-lg p-4 space-y-2">
        <p>
          <strong>Source PR:</strong> {rfq.source_pr_number}
        </p>
        <p>
          <strong>Remarks:</strong> {rfq.remarks || "-"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(rfq.created_at).toLocaleString("en-GB")}
        </p>
      </div>

      {/* Items Section */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">RFQ Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 border">Material</th>
                <th className="px-3 py-2 border">Description</th>
                <th className="px-3 py-2 border">Remarks</th>
                <th className="px-3 py-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rfq.items.map((item: RFQItem) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 border">{item.material_name}</td>
                  <td className="px-3 py-2 border">{item.material_description || "-"}</td>
                  <td className="px-3 py-2 border">{item.material_specification || "-"}</td>
                  <td className="px-3 py-2 border">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border rounded-lg p-4">
  <h2 className="text-lg font-semibold mb-3">Attachments</h2>

  {rfq.attachments?.length === 0 ? (
    <p className="text-sm text-gray-500">No attachments</p>
  ) : (
    <ul className="space-y-2">
      {rfq.attachments.map((file: any) => (
        <li key={file.id}>
          <a
            href={`${BASE_URL}/uploads/${file.file_path}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            {file.file_name}
          </a>
        </li>
      ))}
    </ul>
  )}
</div>
      </div>

      {/* Vendors Section */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Invited Vendors</h2>

        {vendors.length === 0 ? (
          <p className="text-sm text-gray-500">No vendors invited yet.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 border w-16">Select</th>
                <th className="px-3 py-2 border">Vendor Name</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Invited At</th>
                <th className="px-3 py-2 border">Responded At</th>
                <th className="px-3 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.rfq_vendor_id}>
                  <td className="px-3 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(v.vendor_id)}
                      onChange={() => {
                        setSelectedVendors((prev) =>
                          prev.includes(v.vendor_id)
                            ? prev.filter((id) => id !== v.vendor_id)
                            : [...prev, v.vendor_id],
                        );
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 border">{v.vendor_name}</td>
                  <td className="px-3 py-2 border">{v.status}</td>
                  <td className="px-3 py-2 border">
                    {v.invited_at
                      ? new Date(v.invited_at.replace(" ", "T")).toLocaleString(
                          "en-GB",
                        )
                      : "-"}
                  </td>

                  <td className="px-3 py-2 border">
                    {v.responded_at
                      ? new Date(
                          v.responded_at.replace(" ", "T"),
                        ).toLocaleString("en-GB")
                      : "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {rfq.status !== "CLOSED" && rfq.status !== "CANCELLED" && (
                      <Button
                        title={
                          v.status === "RESPONDED"
                            ? "Edit Quotation"
                            : "Enter Quotation"
                        }
                        variant="primary"
                        onClick={() =>
                          router.push(
                            `/dashboard/procurement/rfq-management/${rfq.id}/vendor/${v.rfq_vendor_id}/quotation`,
                          )
                        }
                      />
                    )}

                    <Button
                      title="Delete"
                      variant="danger"
                      onClick={async () => {
                        const confirmDelete = confirm(
                          "Remove this vendor from RFQ?",
                        );
                        if (!confirmDelete) return;

                        try {
                          await removeVendorFromRFQ(rfq.id, v.rfq_vendor_id);

                          // 🔥 ALWAYS RELOAD FROM BACKEND
                          await fetchVendors();
                        } catch (err) {
                          console.error(err);
                          alert("Failed to remove vendor");
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          title="Back"
          variant="secondary"
          onClick={() => router.push("/dashboard/procurement/rfq-management")}
        />

        {(rfq.status !== "CLOSED" && rfq.status !== "CANCELLED") && (
            <Button
              title="Invite Vendors"
              onClick={() =>
                router.push(
                  `/dashboard/procurement/rfq-management/${rfq.id}/invite-vendor`,
                )
              }
            />
          )}

        {rfq.status !== "CLOSED" && rfq.status !== "CANCELLED" && (
          <>
            <Button
              title="View Comparison"
              variant="secondary"
              onClick={() =>
                router.push(
                  `/dashboard/procurement/rfq-management/${rfq.id}/comparison`,
                )
              }
            />
          </>
        )}

        {rfq.status === "CLOSED" && (
          <Button
            title="View PO"
            variant="secondary"
            onClick={() => {
              // later fetch PO id from backend
            }}
          />
        )}

        <Button
          title="Send Email"
          variant="primary"
          onClick={async () => {
            try {
              if (selectedVendors.length === 0) {
                alert("Select at least one vendor");
                return;
              }

              await sendRFQEmails(rfq_id as string, selectedVendors);

              alert("Emails sent successfully");
            } catch (err) {
              console.error(err);
              alert("Failed to send emails");
            }
          }}
        />
      </div>
    </div>
  );
}
