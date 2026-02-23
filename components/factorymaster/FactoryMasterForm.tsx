"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    <MasterFormLayout
      title="Factory Master"
      description="Create and manage factory locations"
      actions={
        <Button
          title={loading ? "Saving..." : "Save Factory"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
        />
      }
    >
      {/* ===== Location Info ===== */}
      <div className="md:col-span-2">
        <h3 className="text-sm font-semibold text-gray-600">
          Location Information
        </h3>
      </div>

      <div>
        <Label>Location Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter location name"
        />
      </div>

      <div>
        <Label>Coordinates</Label>
        <Input
          name="coordinates"
          value={form.coordinates}
          onChange={handleChange}
          placeholder="Latitude, Longitude"
        />
      </div>

      <div className="md:col-span-2">
        <Label>Description</Label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Enter factory description"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* ===== Address Info ===== */}
      <div className="md:col-span-2 mt-4">
        <h3 className="text-sm font-semibold text-gray-600">
          Address Details
        </h3>
      </div>

      <div>
        <Label>Address Line 1</Label>
        <Input
          name="address1"
          value={form.address1}
          onChange={handleChange}
          placeholder="Address line 1"
        />
      </div>

      <div>
        <Label>Address Line 2</Label>
        <Input
          name="address2"
          value={form.address2}
          onChange={handleChange}
          placeholder="Address line 2"
        />
      </div>

      <div>
        <Label>Address Line 3</Label>
        <Input
          name="address3"
          value={form.address3}
          onChange={handleChange}
          placeholder="Address line 3"
        />
      </div>

      {/* ===== Contact Info ===== */}
      <div className="md:col-span-2 mt-4">
        <h3 className="text-sm font-semibold text-gray-600">
          Contact Information
        </h3>
      </div>

      <div>
        <Label>Incharge Person Name</Label>
        <Input
          name="incharge_name"
          value={form.incharge_name}
          onChange={handleChange}
          placeholder="Enter incharge name"
        />
      </div>

      <div>
        <Label>Mobile Number</Label>
        <Input
          type="tel"
          name="mobile_number"
          value={form.mobile_number}
          onChange={handleChange}
          placeholder="Enter mobile number"
        />
      </div>

      <div>
        <Label>Email ID</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email address"
        />
      </div>
    </MasterFormLayout>
  );
}