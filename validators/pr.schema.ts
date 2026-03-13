import { z } from "zod";

/* ================= ITEM SCHEMA ================= */

export const prItemSchema = z.object({
  material_id: z.string().min(1, "Material is required"),
  material_code: z.string(),
  material_name: z.string(),
  unit_id: z.string().min(1),

  requested_qty: z
    .number()
    .min(0.001, "Quantity must be greater than 0"),

  estimated_rate: z
    .number()
    .min(0, "Rate cannot be negative"),

  required_by_date: z
    .string()
    .min(1, "Required date is required"),
});

/* ================= HEADER SCHEMA ================= */

export const prSchema = z.object({
  factory_id: z.string().min(1, "Factory is required"),
  warehouse_id: z.string().min(1, "Warehouse is required"),
  department: z.string().min(1, "Department is required"),
  priority: z.string().min(1),
  remarks: z
    .string()
    .max(500, "Remarks too long")
    .optional(),

  items: z
    .array(prItemSchema)
    .min(1, "At least one item is required"),
});

export type PRFormData = z.infer<typeof prSchema>;