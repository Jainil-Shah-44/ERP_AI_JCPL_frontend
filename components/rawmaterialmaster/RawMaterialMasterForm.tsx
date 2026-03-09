"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import Toast from "@/components/ui/Toast";

import { getCategories } from "@/services/categorymaster.service";
import { getGroups } from "@/services/groupmaster.service";
import { getUnits } from "@/services/unitmaster.service";

type Option = { id: string; name?: string; unit_code?: string };

type RawMaterialFormData = {
  material_code: string;
  material_name: string;
  description?: string;
  category_id: string;
  group_id: string;
  unit_id: string;
};

type Props = {
  initialData?: RawMaterialFormData;
  onSubmit: (data: RawMaterialFormData) => Promise<void>;
};

export default function RawMaterialMasterForm({
  initialData,
  onSubmit,
}: Props) {
  const [categories, setCategories] = useState<Option[]>([]);
  const [groups, setGroups] = useState<Option[]>([]);
  const [units, setUnits] = useState<Option[]>([]);

  const [form, setForm] = useState<RawMaterialFormData>({
    material_code: initialData?.material_code || "",
    material_name: initialData?.material_name || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || "",
    group_id: initialData?.group_id || "",
    unit_id: initialData?.unit_id || "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);

  useEffect(() => {
    getCategories().then(setCategories);
    getGroups().then(setGroups);
    getUnits().then(setUnits);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const validate = (): string | null => {

    if (!form.material_code.trim())
      return "Material code is required";

    if (!form.material_name.trim())
      return "Material name is required";

    if (!form.category_id)
      return "Category is required";

    if (!form.group_id)
      return "Group is required";

    if (!form.unit_id)
      return "Unit is required";

    return null;
  };

  const handleSubmit = async () => {

    const validationError = validate();

    if (validationError) {
      setToast({ msg: validationError, type: "error" });
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MasterFormLayout
        title="Raw Material Master"
        description="Create and manage raw material details"
        actions={
          <Button
            title={loading ? "Saving..." : "Save Material"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        }
      >
        <div>
          <Label>Material Code</Label>
          <Input
            name="material_code"
            value={form.material_code}
            onChange={handleChange}
            placeholder="Enter material code"
          />
        </div>

        <div>
          <Label>Material Name</Label>
          <Input
            name="material_name"
            value={form.material_name}
            onChange={handleChange}
            placeholder="Enter material name"
          />
        </div>

        <div className="md:col-span-2">
          <Label>Description</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional description"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <Label>Category</Label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Group</Label>
          <select
            name="group_id"
            value={form.group_id}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Group --</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Unit</Label>
          <select
            name="unit_id"
            value={form.unit_id}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Unit --</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unit_code}
              </option>
            ))}
          </select>
        </div>
      </MasterFormLayout>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          position="top-center"
          autoClose={2000}
        />
      )}
    </>
  );
}