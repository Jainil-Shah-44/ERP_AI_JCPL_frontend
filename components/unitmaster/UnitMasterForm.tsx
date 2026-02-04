"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUnits, UnitMaster } from "@/services/unitmaster.service";

type UnitFormData = {
  unit_code: string;
  description?: string;
  base_unit_id?: string;
  conversion_factor?: number;
};

type Props = {
  initialData?: UnitFormData;
  onSubmit: (data: UnitFormData) => Promise<void>;
};

export default function UnitMasterForm({ initialData, onSubmit }: Props) {
  const [units, setUnits] = useState<UnitMaster[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<UnitFormData>({
    unit_code: initialData?.unit_code || "",
    description: initialData?.description || "",
    base_unit_id: initialData?.base_unit_id || "",
    conversion_factor: initialData?.conversion_factor,
  });

  useEffect(() => {
    getUnits().then(setUnits);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "conversion_factor" ? Number(value) : value,
    }));
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
          <Label>Unit Code</Label>
          <Input
            name="unit_code"
            value={form.unit_code}
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
          <Label>Base Unit</Label>
          <select
            name="base_unit_id"
            value={form.base_unit_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Base Unit --</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unit_code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Conversion Factor</Label>
          <Input
            type="number"
            step="any"
            name="conversion_factor"
            value={form.conversion_factor ?? ""}
            onChange={handleChange}
          />
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
