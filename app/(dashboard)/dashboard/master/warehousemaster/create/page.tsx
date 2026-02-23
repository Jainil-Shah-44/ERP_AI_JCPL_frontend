"use client";

import { useRouter } from "next/navigation";
import WarehouseMasterForm from "@/components/warehousemaster/WarehouseMasterForm";
import { createWarehouse } from "@/services/warehousemaster.service";

export default function CreateWarehouseMasterPage() {
  const router = useRouter();

  return (
    <WarehouseMasterForm
      onSubmit={async (data) => {
        await createWarehouse(data);
        router.push("/dashboard/master/warehousemaster");
      }}
    />
  );
}