export type Vendor = {
  id: string;
  name: string;
  value?: string;
  contact_number: string;
  address_line1: string;
  address_line2: string;
  email: string;
};

export type Factory = {
  id: string;
  name: string;
  range: string;
  division: string;
  commissionerate: string;
  gstin: string;
};

export type Material = {
  id: string;
  material_name: string;
  unit_id?: string | null;
  unit_name?: string;
  source?: "master" | "po";
};