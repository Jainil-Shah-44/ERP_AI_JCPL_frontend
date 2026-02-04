"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import VendorMasterForm from "@/components/vendormaster/VendorMasterForm";
import {
  getVendors,
  updateVendor,
  VendorMaster,
} from "@/services/vendormaster.service";

export default function EditVendorMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorMaster | null>(null);

  useEffect(() => {
    getVendors().then((list) => {
      setVendor(list.find((v) => v.id === id) || null);
    });
  }, [id]);

  if (!vendor) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Edit Vendor
      </h1>

      <VendorMasterForm
        initialData={vendor}
        onSubmit={async (data) => {
          await updateVendor(vendor.id, data);
          router.push("/dashboard/master/vendormaster");
        }}
      />
    </div>
  );
}
