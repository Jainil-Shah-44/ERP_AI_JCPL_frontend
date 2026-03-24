"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPODetail, updatePO} from "@/services/purchaseorder.service";
import POForm from "@/components/purchase-order/POForm";

export default function EditPOPage() {
  const { po_id } = useParams();
  const router = useRouter();

  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    if (!po_id) return;
    loadPO();
  }, [po_id]);

  const loadPO = async () => {
    const res = await getPODetail(po_id as string);
    setPo(res);
  };

  if (!po) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Edit Purchase Order
      </h1>

      <POForm
  mode="edit"
  initialData={po}
  onSubmit={async (data) => {
    await updatePO(po.id, data);
    router.push(`/dashboard/procurement/purchase-order/${po.id}`);
  }}
/>
    </div>
  );
}