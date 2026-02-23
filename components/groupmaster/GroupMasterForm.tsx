"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

type GroupFormData = {
  name: string;
  description?: string;
};

type Props = {
  initialData?: GroupFormData;
  onSubmit: (data: GroupFormData) => Promise<void>;
};

export default function GroupMasterForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<GroupFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
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
      title="Item Group Master"
      description="Create and manage item groups"
      actions={
        <Button
          title={loading ? "Saving..." : "Save Group"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
        />
      }
    >
      <div>
        <Label>Item Group Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter item group name"
        />
      </div>

      <div className="md:col-span-2">
        <Label>Description</Label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Optional description"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </MasterFormLayout>
  );
}