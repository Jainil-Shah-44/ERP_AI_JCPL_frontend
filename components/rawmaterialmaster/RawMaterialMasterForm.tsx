"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  useEffect(() => {
    getCategories().then(setCategories);
    getGroups().then(setGroups);
    getUnits().then(setUnits);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label>Material Code</Label>
          <Input
            name="material_code"
            value={form.material_code}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Material Name</Label>
          <Input
            name="material_name"
            value={form.material_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Category</Label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
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
            className="w-full border rounded px-3 py-2"
            required
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
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Select Unit --</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unit_code}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex gap-4 mt-8 border-t pt-6">
        <Button
          title={loading ? "Saving..." : "Save"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}
