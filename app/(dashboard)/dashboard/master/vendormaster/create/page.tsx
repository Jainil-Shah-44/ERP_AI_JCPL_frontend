"use client";

import { useRouter } from "next/navigation";
import VendorMasterForm from "@/components/vendormaster/VendorMasterForm";
import { createVendor } from "@/services/vendormaster.service";

export default function CreateVendorMasterPage() {
  const router = useRouter();

  return (
    <VendorMasterForm
      onSubmit={async (data) => {
        await createVendor(data);
        router.push("/dashboard/master/vendormaster");
      }}
    />
  );
}