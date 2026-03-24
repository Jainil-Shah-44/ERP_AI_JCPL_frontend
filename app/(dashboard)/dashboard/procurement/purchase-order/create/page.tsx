"use client";

import { useRouter } from "next/navigation";
import POForm from "@/components/purchase-order/POForm";
import { createPO } from "@/services/purchaseorder.service";

export default function CreatePOPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    await createPO(data);
    router.push("/dashboard/procurement/purchase-order");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create Purchase Order</h1>
      <POForm
  mode="create"
  onSubmit={async (data) => {
    await createPO(data);
    router.push("/dashboard/procurement/purchase-order");
  }}
/>
    </div>
  );
}