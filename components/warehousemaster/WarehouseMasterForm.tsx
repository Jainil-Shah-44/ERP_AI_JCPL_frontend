"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import Toast from "@/components/ui/Toast";

type WarehouseFormData = {
  name: string;
  location?: string;
  state?: string;
  pincode?: string;
  incharge?: string;
};

type Props = {
  initialData?: WarehouseFormData;
  onSubmit: (data: WarehouseFormData) => Promise<void>;
};

export default function WarehouseMasterForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<WarehouseFormData>({
    name: initialData?.name || "",
    location: initialData?.location || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    incharge: initialData?.incharge || "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const validate = (): string | null => {

    if (!form.name.trim())
      return "Warehouse name is required";

    if (!form.location?.trim())
      return "Location is required";

    if (!form.state?.trim())
      return "State is required";

    if (!form.pincode?.trim())
      return "Pincode is required";

    if (!form.incharge?.trim())
      return "Incharge person is required";

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
        title="Warehouse Master"
        description="Create and manage warehouse details"
        actions={
          <Button
            title={loading ? "Saving..." : "Save Warehouse"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        }
      >
        {/* Warehouse Name */}
        <div className="md:col-span-2">
          <Label>
            Warehouse Name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter warehouse name"
          />
        </div>

        {/* Location Section */}
        <h2 className="text-md font-semibold text-gray-700 md:col-span-2">
          Location Details
        </h2>

        <div>
          <Label>
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter city / area"
          />
        </div>

        <div>
          <Label>
            State <span className="text-red-500">*</span>
          </Label>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>

        <div>
          <Label>
            Pincode <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
          />
        </div>

        <div>
          <Label>
            Incharge Person <span className="text-red-500">*</span>
          </Label>
          <Input
            name="incharge"
            value={form.incharge}
            onChange={handleChange}
            placeholder="Enter incharge name"
          />
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