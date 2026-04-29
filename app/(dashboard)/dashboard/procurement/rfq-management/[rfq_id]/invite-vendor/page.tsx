"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import {
  getVendorsPaginated,
  updateVendorEmail,
} from "@/services/vendormaster.service";
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVendors();
  }, [search, page]);

  const loadVendors = async () => {
    try {
      const res = await getVendorsPaginated(search, page, 5);
      setVendors(res.data || []);
      setTotal(res.total || 0);
    } catch (error) {
      console.error("Failed to load vendors", error);
    }
  };

  const handleSelect = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId],
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
      router.push(`/dashboard/procurement/rfq-management/${rfq_id}`);
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
        <h1 className="text-xl font-semibold">Invite Vendors</h1>

        <div className="flex gap-2">
          <Button
            title="Add Vendor"
            variant="primary"
            onClick={() => router.push("/dashboard/master/vendormaster/create")}
          />

          <Button
            title="Back"
            variant="secondary"
            onClick={() =>
              router.push(`/dashboard/procurement/rfq-management/${rfq_id}`)
            }
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search vendor..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="bg-white border rounded-lg p-4">
        <Label className="mb-3 block">Select Vendors</Label>

        {vendors.length === 0 ? (
          <p className="text-gray-400 text-sm">No vendors available</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 border w-16">Select</th>
                    <th className="px-3 py-2 border text-left">Vendor Name</th>
                    <th className="px-3 py-2 border text-left">Email</th>
                    <th className="px-3 py-2 border text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-4 text-gray-400"
                      >
                        No vendors found
                      </td>
                    </tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-3 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={selectedVendors.includes(vendor.id)}
                            onChange={() => handleSelect(vendor.id)}
                          />
                        </td>
                        <td className="px-3 py-2 border">{vendor.name}</td>
                        <td className="px-3 py-2 border">
                          {editingVendorId === vendor.id ? (
                            <input
                              type="email"
                              className="border px-2 py-1 rounded w-full"
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                            />
                          ) : (
                            vendor.email || "-"
                          )}
                        </td>
                        <td className="px-3 py-2 border">
                          {editingVendorId === vendor.id ? (
                            <div className="flex gap-2">
                              <Button
                                title={saving ? "Saving..." : "Save"}
                                variant="primary"
                                onClick={async () => {
                                  try {
                                    setSaving(true);

                                    await updateVendorEmail(
                                      vendor.id,
                                      emailInput,
                                    );

                                    setVendors((prev) =>
                                      prev.map((v) =>
                                        v.id === vendor.id
                                          ? { ...v, email: emailInput }
                                          : v,
                                      ),
                                    );

                                    setEditingVendorId(null);
                                  } catch (err) {
                                    alert("Failed to update email");
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                              />

                              <Button
                                title="Cancel"
                                variant="secondary"
                                onClick={() => setEditingVendorId(null)}
                              />
                            </div>
                          ) : (
                            <Button
                              title="Edit"
                              variant="secondary"
                              onClick={() => {
                                setEditingVendorId(vendor.id);
                                setEmailInput(vendor.email || "");
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                title="Prev"
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              />

              <span className="text-sm">
                Page {page} of {Math.ceil(total / 5)}
              </span>

              <Button
                title="Next"
                variant="secondary"
                disabled={page * 5 >= total}
                onClick={() => setPage((p) => p + 1)}
              />
            </div>
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
