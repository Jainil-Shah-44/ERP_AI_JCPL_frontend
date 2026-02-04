"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default function WarehouseMasterForm({ initialData, onSubmit }: Props) {
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
    <div className="bg-white border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label>Warehouse Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Location</Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>State</Label>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Pincode</Label>
          <Input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Incharge</Label>
          <Input
            name="incharge"
            value={form.incharge}
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
