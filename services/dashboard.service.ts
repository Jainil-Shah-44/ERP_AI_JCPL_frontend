import { apiFetch } from "@/lib/api";

export type PRStats = {
  DRAFT: number;
  SUBMITTED: number;
  REJECTED: number;
  APPROVED: number;
};

export const getPRDashboardStats = async (): Promise<PRStats> => {
  return await apiFetch("/dashboard/pr-stats", {
    method: "GET",
  });
};

// ==========================================
// Purchase Order (PO) Stats
// ==========================================

export type POStats = {
  ALL: number;
  DRAFT: number;
  RELEASED: number;
  CANCELLED: number;
};

export const getPODashboardStats = async (): Promise<POStats> => {
  return await apiFetch("/dashboard/po-stats", {
    method: "GET",
  });
};

// ==========================================
// Goods Receipt Note (GRN) Stats
// ==========================================

export type GRNStats = {
  DRAFT: number;
  SUBMITTED: number;
};

export const getGRNDashboardStats = async (): Promise<GRNStats> => {
  return await apiFetch("/dashboard/grn-stats", {
    method: "GET",
  });
};