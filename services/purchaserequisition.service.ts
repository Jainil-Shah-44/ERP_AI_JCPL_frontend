import { apiFetch } from "@/lib/api";

export type PurchaseRequisitionItem = {
  material_id: string;
  material_code: string;
  material_name: string;
  requested_qty: number;
  unit_id: string;
  estimated_rate: number;
  required_by_date: string;
};

export type CreatePurchaseRequisitionPayload = {
  factory_id: string;
  warehouse_id: string;
  department: string;
  priority: string;
  remarks: string;
  items: {
    material_id: string;
    material_code: string;
    material_name: string;
    unit_id: string;
    requested_qty: number;
    estimated_rate: number;
    required_by_date: string; // now only here
  }[];
};

export const createPurchaseRequisition = (
  data: CreatePurchaseRequisitionPayload
) =>
  apiFetch("/procurement/purchase-requisition", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ---------------- UPLOAD ATTACHMENT ---------------- */

export const uploadPurchaseRequisitionAttachment = (
  prId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(
    `/procurement/purchase-requisition/${prId}/attachment`,
    {
      method: "POST",
      body: formData,
    }
  );
};

/* ---------------- Submit Purchase Requisition  ---------------- */

export const submitPurchaseRequisition = (prId: string) => {
  return apiFetch(
    `/procurement/purchase-requisition/${prId}/submit`,
    {
      method: "POST",
    }
  );
};


/* ---------------- GET PURCHASE REQUISITION LIST ---------------- */

export type PurchaseRequisitionListResponse = {
  total: number;
  page: number;
  limit: number;
  data: any[]; // later you can create proper PR type instead of any
};

export const getPurchaseRequisitions = (
  page: number = 1,
  limit: number = 10000
) => {
  return apiFetch(
    `/procurement/purchase-requisition/?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

/* ---------------- APPROVE PURCHASE REQUISITION ---------------- */

export const approvePurchaseRequisition = (
  prId: string,
  remarks: string
) => {
  return apiFetch(
    `/procurement/purchase-requisition/${prId}/approve?remarks=${encodeURIComponent(
      remarks
    )}`,
    {
      method: "POST",
    }
  );
};

/* ---------------- REJECT PURCHASE REQUISITION ---------------- */

export const rejectPurchaseRequisition = (
  prId: string,
  remarks: string
) => {
  return apiFetch(
    `/procurement/purchase-requisition/${prId}/reject?remarks=${encodeURIComponent(
      remarks
    )}`,
    {
      method: "POST",
    }
  );
};

/* ---------------- get PURCHASE REQUISITION Attachments ---------------- */

export const getPurchaseRequisitionAttachments = async (id: string) => {
    return await apiFetch(
        `/procurement/purchase-requisition/${id}/attachments`,
        {
            method: "GET",
        }
    );
};

/* ---------------- GET single PR by id ---------------- */

export const getPurchaseRequisitionById = async (id: string) => {
    return await apiFetch(
        `/procurement/purchase-requisition/${id}`,
        { method: "GET" }
    );
};
/* ---------------- UPDATE PR ---------------- */

export const updatePurchaseRequisition = async (
    id: string,
    data: any
) => {
    return await apiFetch(
        `/procurement/purchase-requisition/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
};
