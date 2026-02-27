"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { getVendors } from "@/services/vendormaster.service";
import { inviteVendors } from "@/services/rfq.service";

type Vendor = {
  id: string;
  name: string;
  email?: string;
};

export default function InviteVendorsPage() {
  const { rfq_id } = useParams();
  const router = useRouter();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data || []);
    } catch (error) {
      console.error("Failed to load vendors", error);
    }
  };

  const handleSelect = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSubmit = async () => {
    if (!rfq_id) {
      alert("RFQ ID missing");
      return;
    }

    if (selectedVendors.length === 0) {
      alert("Select at least one vendor");
      return;
    }

    try {
      setLoading(true);

      await inviteVendors(rfq_id as string, selectedVendors);

      // 🔥 Redirect back to RFQ detail
      router.push(
        `/dashboard/procurement/rfq-management/${rfq_id}`
      );

    } catch (error) {
      console.error("Invite failed", error);
      alert("Failed to invite vendors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Invite Vendors
        </h1>

        <Button
          title="Back"
          variant="secondary"
          onClick={() =>
            router.push(
              `/dashboard/procurement/rfq-management/${rfq_id}`
            )
          }
        />
      </div>

      <div className="bg-white border rounded-lg p-4">

        <Label className="mb-3 block">
          Select Vendors
        </Label>

        {vendors.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No vendors available
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border w-16">Select</th>
                  <th className="px-3 py-2 border text-left">Vendor Name</th>
                  <th className="px-3 py-2 border text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-3 py-2 border text-center">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => handleSelect(vendor.id)}
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      {vendor.name}
                    </td>
                    <td className="px-3 py-2 border">
                      {vendor.email || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <div className="flex gap-3">
        <Button
          title={loading ? "Sending..." : "Send Invitation"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>

    </div>
  );
}