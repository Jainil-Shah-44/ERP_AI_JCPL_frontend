"use client";

import PurchaseRequisitionForm from "@/components/purchase-requisition/PurchaseRequisitionForm";
import { useParams } from "next/navigation";


export default function EditPRPage() {
  const { id } = useParams();

  return <PurchaseRequisitionForm editId={id as string} />;
}
