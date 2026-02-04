import { apiFetch } from "@/lib/api";

export type CategoryMaster = {
  id: string;
  name: string;
  description?: string;
};

export const getCategories = (): Promise<CategoryMaster[]> =>
  apiFetch("/masters/categories");

export const createCategory = (data: {
  name: string;
  description?: string;
}) =>
  apiFetch("/masters/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCategory = (
  id: string,
  data: {
    name: string;
    description?: string;
  }
) =>
  apiFetch(`/masters/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCategory = (id: string) =>
  apiFetch(`/masters/categories/${id}`, {
    method: "DELETE",
  });
