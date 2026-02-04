"use client";

import { useRouter } from "next/navigation";
import WarehouseMasterForm from "@/components/warehousemaster/WarehouseMasterForm";
import { createWarehouse } from "@/services/warehousemaster.service";

export default function CreateWarehouseMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Create Warehouse
      </h1>

      <WarehouseMasterForm
        onSubmit={async (data) => {
          await createWarehouse(data);
          router.push("/dashboard/master/warehousemaster");
        }}
      />
    </div>
  );
}
