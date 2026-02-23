"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <MasterFormLayout
      title="Warehouse Master"
      description="Create and manage warehouse details"
      actions={
        <Button
          title={loading ? "Saving..." : "Save Warehouse"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
        />
      }
    >
      {/* Warehouse Name */}
      <div className="md:col-span-2">
        <Label>Warehouse Name</Label>
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
        <Label>Location</Label>
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Enter city / area"
        />
      </div>

      <div>
        <Label>State</Label>
        <Input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="Enter state"
        />
      </div>

      <div>
        <Label>Pincode</Label>
        <Input
          type="number"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
        />
      </div>

      <div>
        <Label>Incharge Person</Label>
        <Input
          name="incharge"
          value={form.incharge}
          onChange={handleChange}
          placeholder="Enter incharge name"
        />
      </div>
    </MasterFormLayout>
  );
}