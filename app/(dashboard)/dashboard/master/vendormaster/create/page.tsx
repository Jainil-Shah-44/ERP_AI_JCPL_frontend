"use client";

import { useRouter } from "next/navigation";
import VendorMasterForm from "@/components/vendormaster/VendorMasterForm";
import { createVendor } from "@/services/vendormaster.service";

export default function CreateVendorMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Create Vendor
      </h1>

      <VendorMasterForm
        onSubmit={async (data) => {
          await createVendor(data);
          router.push("/dashboard/master/vendormaster");
        }}
      />
    </div>
  );
}
