"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import Toast from "@/components/ui/Toast";

type VendorFormData = {
  name: string;
  mobile_number1?: string;
  mobile_number2?: string;
  office_number?: string;
  address_line2?: string;
  address_line3?: string;
  state?: string;
  pincode?: string;
  pan_number?: string;
  gst_number?: string;
  email?: string;
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
    address_line2: initialData?.address_line2 || "",
    address_line3: initialData?.address_line3 || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    pan_number: initialData?.pan_number || "",
    gst_number: initialData?.gst_number || "",
    email: initialData?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const validate = (): string | null => {
    if (!form.name.trim()) return "Vendor name is required";

    if (!form.mobile_number1?.trim()) return "Mobile number 1 is required";

    if (!form.state?.trim()) return "State is required";

    if (!form.pincode?.trim()) return "Pincode is required";

    if (!form.pan_number?.trim()) return "PAN number is required";

    if (!form.gst_number?.trim()) return "GST number is required";

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
        title="Vendor Master"
        description="Create and manage vendor details"
        actions={
          <Button
            title={loading ? "Saving..." : "Save Vendor"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        }
      >
        {/* Vendor Name */}
        <div className="md:col-span-2">
          <Label>
            Vendor Name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter vendor name"
          />

          <Input
            name="address_line2"
            value={form.address_line2 || ""}
            onChange={handleChange}
            placeholder="Enter address line 1"
          />

          <Input
            name="address_line3"
            value={form.address_line3 || ""}
            onChange={handleChange}
            placeholder="Enter address line 2"
          />

          <Input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            placeholder="Enter email"
          />


        </div>

        {/* Contact Details */}
        <h2 className="text-md font-semibold text-gray-700 md:col-span-2">
          Contact Details
        </h2>

        <div>
          <Label>
            Mobile Number 1 <span className="text-red-500">*</span>
          </Label>
          {/* <Input
            name="mobile_number1"
            value={form.mobile_number1}
            onChange={handleChange}
            placeholder="Enter mobile number"
          /> */}
          <Input
            type="tel"
            name="mobile_number"
            value={form.mobile_number1}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, mobile_number1: value });
            }}
            placeholder="Enter mobile number"
            maxLength={10}
          />
        </div>

        <div>
          <Label>Mobile Number 2</Label>
          <Input
            type="tel"
            name="mobile_number"
            value={form.mobile_number2}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, mobile_number2: value });
            }}
            placeholder="Enter mobile number"
            maxLength={10}
          />
          {/* <Input
            name="mobile_number2"
            value={form.mobile_number2}
            onChange={handleChange}
            placeholder="Enter alternate mobile"
          /> */}
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
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
          />
        </div>

        <div>
          <Label>
            PAN Number <span className="text-red-500">*</span>
          </Label>
          <Input
            name="pan_number"
            value={form.pan_number}
            onChange={handleChange}
            placeholder="Enter PAN number"
          />
        </div>

        <div>
          <Label>
            GST Number <span className="text-red-500">*</span>
          </Label>
          <Input
            name="gst_number"
            value={form.gst_number}
            onChange={handleChange}
            placeholder="Enter GST number"
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
