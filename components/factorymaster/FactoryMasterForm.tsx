"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import Toast from "@/components/ui/Toast";

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
  const [toast, setToast] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target;

    if (name === "mobile_number") {
      const numbersOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

  };

  /* ================= VALIDATION ================= */

  const validate = (): string | null => {

    if (!form.name?.trim())
      return "Location name is required";

    if (!form.coordinates?.trim())
      return "Coordinates are required";

    if (!form.address1?.trim())
      return "Address line 1 is required";

    if (!form.incharge_name?.trim())
      return "Incharge name is required";

    if (!form.mobile_number)
      return "Mobile number is required";

    if (!/^[0-9]{10}$/.test(form.mobile_number))
      return "Mobile number must be 10 digits";

    if (!form.email?.trim())
      return "Email is required";

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(form.email))
      return "Enter valid email address";

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
        title="Factory Master"
        description="Create and manage factory locations"
        actions={
          <Button
            title={loading ? "Saving..." : "Save Factory"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
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
          <Label>Location Name <span className="text-red-500">*</span></Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter location name"
          />
        </div>

        <div>
          <Label>Coordinates <span className="text-red-500">*</span></Label>
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
          <Label>Address Line 1<span className="text-red-500">*</span></Label>
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
          <Label>Address Line 3 </Label>
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
          <Label>Incharge Person Name <span className="text-red-500">*</span></Label>
          <Input
            name="incharge_name"
            value={form.incharge_name}
            onChange={handleChange}
            placeholder="Enter incharge name"
          />
        </div>

        <div>
          <Label>Mobile Number <span className="text-red-500">*</span></Label>
          <Input
            type="tel"
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleChange}
            placeholder="Enter mobile number"
            maxLength={10}
          />
        </div>

        <div>
          <Label>Email ID <span className="text-red-500">*</span></Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
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