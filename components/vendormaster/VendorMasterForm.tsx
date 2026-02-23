"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

type VendorFormData = {
  name: string;
  mobile_number1?: string;
  mobile_number2?: string;
  office_number?: string;
  state?: string;
  pincode?: string;
  pan_number?: string;
  gst_number?: string;
};

type Props = {
  initialData?: VendorFormData;
  onSubmit: (data: VendorFormData) => Promise<void>;
};

export default function VendorMasterForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<VendorFormData>({
    name: initialData?.name || "",
    mobile_number1: initialData?.mobile_number1 || "",
    mobile_number2: initialData?.mobile_number2 || "",
    office_number: initialData?.office_number || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    pan_number: initialData?.pan_number || "",
    gst_number: initialData?.gst_number || "",
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
      title="Vendor Master"
      description="Create and manage vendor details"
      actions={
        <Button
          title={loading ? "Saving..." : "Save Vendor"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
        />
      }
    >
      {/* Vendor Name */}
      <div className="md:col-span-2">
        <Label>Vendor Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter vendor name"
        />
      </div>

      {/* Contact Details */}
      <h2 className="text-md font-semibold text-gray-700 md:col-span-2">
        Contact Details
      </h2>

      <div>
        <Label>Mobile Number 1</Label>
        <Input
          name="mobile_number1"
          value={form.mobile_number1}
          onChange={handleChange}
          placeholder="Enter mobile number"
        />
      </div>

      <div>
        <Label>Mobile Number 2</Label>
        <Input
          name="mobile_number2"
          value={form.mobile_number2}
          onChange={handleChange}
          placeholder="Enter alternate mobile"
        />
      </div>

      <div>
        <Label>Office Number</Label>
        <Input
          name="office_number"
          value={form.office_number}
          onChange={handleChange}
          placeholder="Enter office number"
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
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
        />
      </div>

      <div>
        <Label>PAN Number</Label>
        <Input
          name="pan_number"
          value={form.pan_number}
          onChange={handleChange}
          placeholder="Enter PAN number"
        />
      </div>

      <div>
        <Label>GST Number</Label>
        <Input
          name="gst_number"
          value={form.gst_number}
          onChange={handleChange}
          placeholder="Enter GST number"
        />
      </div>
    </MasterFormLayout>
  );
}