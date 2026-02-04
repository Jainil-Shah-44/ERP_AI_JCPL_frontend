import { apiFetch } from "@/lib/api";

export type WarehouseMaster = {
  id: string;
  name: string;
  location?: string;
  state?: string;
  pincode?: string;
  incharge?: string;
};

export const getWarehouses = (): Promise<WarehouseMaster[]> =>
  apiFetch("/masters/warehouses");

export const createWarehouse = (data: Omit<WarehouseMaster, "id">) =>
  apiFetch("/masters/warehouses", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWarehouse = (
  id: string,
  data: Partial<Omit<WarehouseMaster, "id">>
) =>
  apiFetch(`/masters/warehouses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteWarehouse = (id: string) =>
  apiFetch(`/masters/warehouses/${id}`, {
    method: "DELETE",
  });
