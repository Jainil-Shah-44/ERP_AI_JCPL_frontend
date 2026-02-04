import { apiFetch } from "@/lib/api";

export type RawMaterialMaster = {
  id: string;
  material_code: string;
  material_name: string;
  description?: string;
  category_id: string;
  group_id: string;
  unit_id: string;
};

export const getRawMaterials = (): Promise<RawMaterialMaster[]> =>
  apiFetch("/masters/raw-materials");

export const createRawMaterial = (
  data: Omit<RawMaterialMaster, "id">
) =>
  apiFetch("/masters/raw-materials", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRawMaterial = (
  id: string,
  data: Partial<Omit<RawMaterialMaster, "id">>
) =>
  apiFetch(`/masters/raw-materials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteRawMaterial = (id: string) =>
  apiFetch(`/masters/raw-materials/${id}`, {
    method: "DELETE",
  });
