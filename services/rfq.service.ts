import { apiFetch } from "@/lib/api";

// 🔹 Get RFQ 
export const getRFQs = async (page: number = 1, limit: number = 20) => {
  return await apiFetch(
    `/rfq/?page=${page}&limit=${limit}`,
    { method: "GET" }
  );
};


// 🔹 Submit RFQ
export const createRFQ = async (payload: {
  pr_id: string;
  pr_item_ids: string[];
  remarks: string;
}) => {
  return await apiFetch("/rfq/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// 🔹 Invite Vendors to RFQ
export const inviteVendors = async (
  rfqId: string,
  vendorIds: string[]
) => {
  return await apiFetch(
    `/rfq/${rfqId}/invite-vendors`,
    {
      method: "POST",
      body: JSON.stringify(vendorIds),
    }
  );
};


// 🔹 Get RFQ By ID
export const getRfqById = async (id: string) => {
  return await apiFetch(`/rfq/${id}`, {
    method: "GET",
  });
};

// 🔹 Submit Quotation
export const submitQuotation = async (
  rfqId: string,
  payload: any
) => {
  return await apiFetch(
    `/rfq/${rfqId}/submit-quotation`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};

// for rfq_vendor Id
export const getRfqVendors = async (rfqId: string) => {
  return await apiFetch(
    `/rfq/${rfqId}/vendors`,
    {
      method: "GET",
    }
  );
};