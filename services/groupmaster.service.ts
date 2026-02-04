import { apiFetch } from "@/lib/api";

export type GroupMaster = {
  id: string;
  name: string;
  description?: string;
};

export const getGroups = (): Promise<GroupMaster[]> =>
  apiFetch("/masters/groups");

export const createGroup = (data: Omit<GroupMaster, "id">) =>
  apiFetch("/masters/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateGroup = (
  id: string,
  data: Partial<Omit<GroupMaster, "id">>
) =>
  apiFetch(`/masters/groups/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteGroup = (id: string) =>
  apiFetch(`/masters/groups/${id}`, {
    method: "DELETE",
  });
