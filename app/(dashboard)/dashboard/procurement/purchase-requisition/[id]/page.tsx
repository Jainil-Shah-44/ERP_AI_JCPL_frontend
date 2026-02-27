"use client";

import { useParams } from "next/navigation";
import PurchaseRequisitionForm from "@/components/purchase-requisition/PurchaseRequisitionForm";

export default function EditPRPage() {
  const params = useParams();

  // Next.js App Router returns string | string[]
  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Invalid PR ID
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PurchaseRequisitionForm editId={id} />
    </div>
  );
}