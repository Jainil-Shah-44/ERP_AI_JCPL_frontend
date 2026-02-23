"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import { getVendors } from "@/services/vendormaster.service";
import { inviteVendors } from "@/services/rfq.service";


export default function InviteVendors() {
    const searchParams = useSearchParams();
    const rfqId = searchParams.get("rfq_id");
    const router = useRouter();

    const [vendors, setVendors] = useState<any[]>([]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ Load Vendor List
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await getVendors();
                setVendors(data);
            } catch (error) {
                console.error("Failed to fetch vendors", error);
            }
        };

        fetchVendors();
    }, []);

    // ✅ Checkbox handler
    const handleSelect = (vendorId: string) => {
        setSelectedVendors((prev) =>
            prev.includes(vendorId)
                ? prev.filter((id) => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    // ✅ Submit Invite
    const handleSubmit = async () => {
        if (!rfqId) {
            alert("RFQ ID not found");
            return;
        }

        if (selectedVendors.length === 0) {
            alert("Please select at least one vendor");
            return;
        }

        try {
            setLoading(true);

            await inviteVendors(rfqId, selectedVendors);

            alert("Vendors Invited Successfully");

            router.push(
                "/dashboard/procurement/rfq-management/rfq_details"
            );
        } catch (error) {
            console.error("Invite failed", error);
            alert("Error inviting vendors");
        } finally {
            setLoading(false);
        }
    };
    return (
        <MasterFormLayout
            title="Invite Vendors"
            description="Select vendors to send RFQ invitation"
            actions={
                <Button
                    title={loading ? "Sending..." : "Send Invitation"}
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading || selectedVendors.length === 0}
                />
            }
        >
            {/* RFQ ID */}
            <div className="md:col-span-2 space-y-1">
                <Label>RFQ ID</Label>
                <p className="text-sm text-gray-600">{rfqId}</p>
            </div>

            {/* Vendor Table */}
            <div className="md:col-span-2 mt-4">
                <Label className="mb-2 block">Vendor List</Label>

                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left w-16">Select</th>
                                <th className="px-4 py-2 text-left">Vendor Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No vendors found
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor: any) => (
                                    <tr
                                        key={vendor.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4"
                                                onChange={() => handleSelect(vendor.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            {vendor.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {vendor.email || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MasterFormLayout>
    );
}