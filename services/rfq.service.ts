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
export const submitQuotation = async (payload: {
  rfq_vendor_id: string;
  items: {
    rfq_item_id: string;
    quoted_rate: number;
    lead_time_days: number;
    remarks: string;
  }[];
}) => {
  return apiFetch(`/rfq/vendor/submit-quotation`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
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

//rfq comparison
export const getRfqComparison = async (rfqId: string) => {
  return await apiFetch(`/rfq/${rfqId}/comparison`, {
    method: "GET",
  });
};

//create PO from RFQ
export const createPOFromRFQ = (payload: {
  rfq_id: string;
  selections: {
    rfq_item_id: string;
    rfq_vendor_id: string;
    final_rate: number;
    lead_time_days: number;
  }[];
}) => {
  return apiFetch(
    `/rfq/${payload.rfq_id}/create-po`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};

export const removeVendorFromRFQ = async (
  rfqId: string,
  rfqVendorId: string
) => {
  return apiFetch(
    `/rfq/${rfqId}/vendor/${rfqVendorId}`,
    {
      method: "DELETE",
    }
  );
};

export const sendRFQEmails = async (
  rfqId: string,
  vendorIds: string[]
) => {
  return apiFetch(
    `/rfq/${rfqId}/send-email`,
    {
      method: "POST",
      body: JSON.stringify(vendorIds),
    }
  );
};

export const getVendorQuotation = async (
  rfq_id: string,
  rfq_vendor_id: string
) => {
  return apiFetch(
    `/rfq/${rfq_id}/vendor/${rfq_vendor_id}/quotation`,
    { method: "GET" }
  );
};