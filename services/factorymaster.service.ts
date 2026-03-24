import { apiFetch } from "@/lib/api";

export type FactoryMaster = {
  id: string;
  name: string;
  description?: string;
  coordinates?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  incharge_name?: string;
  mobile_number?: string;
  email?: string;
};

export const getFactories = (): Promise<FactoryMaster[]> =>
  apiFetch("/masters/factories");

export const createFactory = (data: Omit<FactoryMaster, "id">) =>
  apiFetch("/masters/factories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateFactory = (
  id: string,
  data: Partial<Omit<FactoryMaster, "id">>
) =>
  apiFetch(`/masters/factories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteFactory = (id: string) =>
  apiFetch(`/masters/factories/${id}`, {
    method: "DELETE",
  });

export const searchFactories = (query: string) => {
  return apiFetch(`/masters/factories/search?search=${query}`);
};