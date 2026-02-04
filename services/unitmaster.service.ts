import { apiFetch } from "@/lib/api";

export type UnitMaster = {
  id: string;
  unit_code: string;
  description?: string;
  base_unit_id?: string;
  conversion_factor?: number;
};

export const getUnits = (): Promise<UnitMaster[]> =>
  apiFetch("/masters/units");

export const createUnit = (data: Omit<UnitMaster, "id">) =>
  apiFetch("/masters/units", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateUnit = (
  id: string,
  data: Partial<Omit<UnitMaster, "id">>
) =>
  apiFetch(`/masters/units/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteUnit = (id: string) =>
  apiFetch(`/masters/units/${id}`, {
    method: "DELETE",
  });
