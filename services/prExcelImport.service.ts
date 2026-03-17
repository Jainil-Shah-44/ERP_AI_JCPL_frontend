import { apiFetch } from "@/lib/api";

export const importPRFromExcel = async (rows: any[]) => {
  try {
    return await apiFetch("/procurement/purchase-requisition/import-excel", {
      method: "POST",
      body: JSON.stringify({ rows })
    });
  } catch (err:any) {
    console.error(err);
    throw new Error(err.message || "Excel import failed");
  }
};