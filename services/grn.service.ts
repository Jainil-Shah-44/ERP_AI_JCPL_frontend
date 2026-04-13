const API_BASE = "/grn";

import { apiFetch } from "@/lib/api";

// =============================
// CREATE GRN
// =============================
export const createGRN = (data: any) =>
  apiFetch(API_BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });

// =============================
// UPDATE GRN
// =============================
export const updateGRN = (id: string, data: any) =>
  apiFetch(`${API_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// =============================
// SUBMIT GRN
// =============================
export const submitGRN = (id: string) =>
  apiFetch(`${API_BASE}/${id}/submit`, {
    method: "POST",
  });

// =============================
// CANCEL GRN
// =============================
export const cancelGRN = (id: string) =>
  apiFetch(`${API_BASE}/${id}/cancel`, {
    method: "POST",
  });

// =============================
// LIST GRN
// =============================
export const getGRNList = (page = 1, limit = 20) =>
  apiFetch(`${API_BASE}?page=${page}&limit=${limit}`);

// =============================
// GET GRN DETAIL
// =============================
export const getGRNDetail = (id: string) =>
  apiFetch(`${API_BASE}/${id}`);

// =============================
// GET PO PENDING ITEMS
// =============================
export const getPOPendingItems = (poId: string, grnId?: string) =>
  apiFetch(
    grnId
      ? `/grn/po/${poId}/pending-items?grn_id=${grnId}`
      : `/grn/po/${poId}/pending-items`
  );

export const downloadGRNPDF = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/grn/${id}/pdf`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `GRN-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const getAvailablePOs = () =>
  apiFetch("/grn/available-pos");