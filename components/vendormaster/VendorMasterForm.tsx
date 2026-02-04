"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default function VendorMasterForm({ initialData, onSubmit }: Props) {
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
    <div className="bg-white border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
        <Label>Vendor Name</Label>
        <Input
            name="name"                 // ✅ MATCHES DB
            value={form.name}
            onChange={handleChange}
            required
        />
        </div>

        <div>
          <Label>Mobile Number 1</Label>
          <Input name="mobile_number1" value={form.mobile_number1} onChange={handleChange} />
        </div>

        <div>
          <Label>Mobile Number 2</Label>
          <Input name="mobile_number2" value={form.mobile_number2} onChange={handleChange} />
        </div>

        <div>
          <Label>Office Number</Label>
          <Input name="office_number" value={form.office_number} onChange={handleChange} />
        </div>

        <div>
          <Label>State</Label>
          <Input name="state" value={form.state} onChange={handleChange} />
        </div>

        <div>
          <Label>Pincode</Label>
          <Input name="pincode" value={form.pincode} onChange={handleChange} />
        </div>

        <div>
          <Label>PAN Number</Label>
          <Input name="pan_number" value={form.pan_number} onChange={handleChange} />
        </div>

        <div>
          <Label>GST Number</Label>
          <Input name="gst_number" value={form.gst_number} onChange={handleChange} />
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
