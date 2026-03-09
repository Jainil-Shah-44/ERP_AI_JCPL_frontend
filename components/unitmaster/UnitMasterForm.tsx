"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import { getUnits, UnitMaster } from "@/services/unitmaster.service";
import Toast from "@/components/ui/Toast";

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
  const [toast, setToast] = useState<any>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "conversion_factor"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  /* ================= VALIDATION ================= */

  const validate = (): string | null => {

    if (!form.unit_code.trim())
      return "Unit code is required";

    if (!form.base_unit_id)
      return "Base unit is required";

    if (!form.conversion_factor)
      return "Conversion factor is required";

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
        title="Unit Master"
        description="Create and manage measurement units"
        actions={
          <Button
            title={loading ? "Saving..." : "Save Unit"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        }
      >
        <div>
          <Label>Unit Code <span className="text-red-500">*</span></Label>
          <Input
            name="unit_code"
            value={form.unit_code}
            onChange={handleChange}
            placeholder="e.g. KG, LTR, PCS"
          />
        </div>

        <div>
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
          <Label>Base Unit <span className="text-red-500">*</span></Label>
          <select
            name="base_unit_id"
            value={form.base_unit_id}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <Label>Conversion Factor <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            step="any"
            name="conversion_factor"
            value={form.conversion_factor ?? ""}
            onChange={handleChange}
            placeholder="e.g. 1000"
            disabled={!form.base_unit_id}
          />
          {!form.base_unit_id && (
            <p className="text-xs text-gray-400 mt-1">
              Select base unit to enable conversion
            </p>
          )}
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