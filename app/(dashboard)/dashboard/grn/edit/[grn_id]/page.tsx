"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GRNForm from "@/components/grn/GRNForm";
import { getGRNDetail, updateGRN } from "@/services/grn.service";

export default function EditGRNPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.grn_id === "string"
      ? params.grn_id
      : params.grn_id?.[0];

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetchData(id);
  }, [id]);

  const fetchData = async (grnId: string) => {
    const res = await getGRNDetail(grnId);

    const mapped = {
      po_id: res.po_id,
      factory_id: res.factory_id,
      factory_name: res.factory_name,
      remarks: res.remarks,
      items: res.items.map((item: any) => ({
        ...item,
        po_item_id: item.po_item_id,
      })),
    };

    setInitialData(mapped);
  };

  const handleSubmit = async (data: any) => {
    if (!id) return;

    await updateGRN(id, data);
    router.push(`/dashboard/grn/${id}`);
  };

  if (!id) return <div>Invalid GRN ID</div>;
  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl mb-4">Edit GRN</h1>
      <GRNForm initialData={initialData} onSubmit={handleSubmit} grnId={id} />
    </div>
  );
}