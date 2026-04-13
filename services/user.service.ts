import { apiFetch } from "@/lib/api";

export type User = {
  id: string;
  username: string;
  email?: string;
  mobile_number?: string;
  role: string;
  location?: string;
  is_active: boolean;
};

export const createUser = (data: {
  username: string;
  email: string;
  mobile_number: string;
  role: string;
  location: string;
  password: string;
  factory_ids?: string[];
}) => {
  return apiFetch("/masters/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getUsers = (): Promise<User[]> => {
  return apiFetch("/masters/users", {
    method: "GET",
  });
};


export const getUserById = async (id: string): Promise<User> => {
  const users = await getUsers();
  const user = users.find((u: User) => u.id === id);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = (id: string, data: Partial<User> & {
  factory_ids?: string[]}) => {
  return apiFetch(`/masters/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deactivateUser = (id: string) => {
  return apiFetch(`/masters/users/${id}`, {
    method: "DELETE",
  });
};