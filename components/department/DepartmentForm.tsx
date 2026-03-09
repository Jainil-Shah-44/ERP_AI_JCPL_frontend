"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import Toast from "@/components/ui/Toast";

type Props = {
  initialData?: {
    name: string;
    description?: string;
  };
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
};

export default function DepartmentForm({
  initialData,
  onSubmit,
}: Props) {

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);

  /* ================= VALIDATION ================= */

  const validate = (): string | null => {

    if (!name.trim())
      return "Department name is required";

    if (name.trim().length < 2)
      return "Department name must be at least 2 characters";

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
      await onSubmit({ name, description });
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <MasterFormLayout
        title="Department Master"
        description="Create and manage departments"
        actions={
          <Button
            title={loading ? "Saving..." : "Save Department"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        }
      >

        {/* Department Name */}
        <div>
          <Label>
            Department Name <span className="text-red-500">*</span>
          </Label>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label>Description</Label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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