import { apiFetch } from "@/lib/api";

export type Department = {
  id: string;
  name: string;
  description?: string;
};

export const getDepartments = (): Promise<Department[]> =>
  apiFetch("/masters/departments");

export const createDepartment = (data: {
  name: string;
  description?: string;
}) =>
  apiFetch("/masters/departments", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDepartment = (
  id: string,
  data: {
    name: string;
    description?: string;
  }
) =>
  apiFetch(`/masters/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteDepartment = (id: string) =>
  apiFetch(`/masters/departments/${id}`, {
    method: "DELETE",
  });
