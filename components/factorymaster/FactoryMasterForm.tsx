"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FactoryFormData = {
  name: string;
  description?: string;
  coordinates?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  incharge_name?: string;
  mobile_number?: string;
  email?: string;
};

type Props = {
  initialData?: FactoryFormData;
  onSubmit: (data: FactoryFormData) => Promise<void>;
};

export default function FactoryMasterForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FactoryFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    coordinates: initialData?.coordinates || "",
    address1: initialData?.address1 || "",
    address2: initialData?.address2 || "",
    address3: initialData?.address3 || "",
    incharge_name: initialData?.incharge_name || "",
    mobile_number: initialData?.mobile_number || "",
    email: initialData?.email || "",
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
          <Label>Location Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <Label>Description</Label>
          <Input name="description" value={form.description} onChange={handleChange} />
        </div>

        <div>
          <Label>Coordinates</Label>
          <Input name="coordinates" value={form.coordinates} onChange={handleChange} />
        </div>

        <div>
          <Label>Address 1</Label>
          <Input name="address1" value={form.address1} onChange={handleChange} />
        </div>

        <div>
          <Label>Address 2</Label>
          <Input name="address2" value={form.address2} onChange={handleChange} />
        </div>

        <div>
          <Label>Address 3</Label>
          <Input name="address3" value={form.address3} onChange={handleChange} />
        </div>

        <div>
          <Label>Incharge Person Name</Label>
          <Input name="incharge_name" value={form.incharge_name} onChange={handleChange} />
        </div>

        <div>
          <Label>Mobile Number</Label>
          <Input name="mobile_number" value={form.mobile_number} onChange={handleChange} />
        </div>

        <div>
          <Label>Email Id</Label>
          <Input name="email" value={form.email} onChange={handleChange} />
        </div>

      </div>

      <div className="flex gap-4 mt-8 border-t pt-6">
        <Button
          title={loading ? "Saving..." : "Save"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
        />
      </div>
    </div>
  );
}
