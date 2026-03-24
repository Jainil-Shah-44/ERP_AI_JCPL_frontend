import { apiFetch } from "@/lib/api";

export const getPOList = (page = 1, limit = 20, status?: string) => {
  let url = `/purchase-order?page=${page}&limit=${limit}`;
  if (status && status !== "ALL") {
    url += `&status=${status}`;
  }
  return apiFetch(url, { method: "GET" });
};

export const getPODetail = (poId: string) => {
  return apiFetch(`/purchase-order/${poId}`, { method: "GET" });
};

export const releasePO = (poId: string) => {
  return apiFetch(`/purchase-order/${poId}/release`, {
    method: "POST",
  });
};

export const cancelPO = (poId: string) => {
  return apiFetch(`/purchase-order/${poId}/cancel`, {
    method: "POST",
  });
};

export const createPO = (data: any) => {
  return apiFetch("/purchase-order/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};