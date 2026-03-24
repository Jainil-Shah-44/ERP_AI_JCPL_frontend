import { apiFetch } from "@/lib/api";

export type VendorMaster = {
  id: string;
  name: string;
  mobile_number1?: string;
  mobile_number2?: string;
  office_number?: string;
  state?: string;
  pincode?: string;
  pan_number?: string;
  gst_number?: string;
};

export const getVendors = (): Promise<VendorMaster[]> =>
  apiFetch("/masters/vendors");

export const createVendor = (data: Omit<VendorMaster, "id">) =>
  apiFetch("/masters/vendors", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateVendor = (
  id: string,
  data: Partial<Omit<VendorMaster, "id">>
) =>
  apiFetch(`/masters/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteVendor = (id: string) =>
  apiFetch(`/masters/vendors/${id}`, {
    method: "DELETE",
  });


export const searchVendors = (query: string) => {
  return apiFetch(`/masters/vendors/search?search=${query}`);
};