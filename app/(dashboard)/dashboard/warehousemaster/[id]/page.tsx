"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WarehouseMasterForm from "@/components/warehousemaster/WarehouseMasterForm";
import {
  getWarehouses,
  updateWarehouse,
  WarehouseMaster,
} from "@/services/warehousemaster.service";

export default function EditWarehouseMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseMaster | null>(null);

  useEffect(() => {
    getWarehouses().then((list) => {
      setWarehouse(list.find((w) => w.id === id) || null);
    });
  }, [id]);

  if (!warehouse) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Edit Warehouse
      </h1>

      <WarehouseMasterForm
        initialData={warehouse}
        onSubmit={async (data) => {
          await updateWarehouse(warehouse.id, data);
          router.push("/dashboard/master/warehousemaster");
        }}
      />
    </div>
  );
}
