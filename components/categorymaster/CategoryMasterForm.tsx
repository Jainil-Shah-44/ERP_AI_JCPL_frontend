"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

type CategoryFormData = {
  name: string;
  description?: string;
};

type Props = {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
};

export default function CategoryMasterForm({
  initialData,
  onSubmit,
}: Props) {
  const [name, setName] = useState<string>(initialData?.name || "");
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({ name, description });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MasterFormLayout
      title="Category Master"
      description="Create and manage item categories"
      actions={
        <Button
          title={loading ? "Saving..." : "Save Category"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
        />
      }
    >
      <div>
        <Label>Category Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
        />
      </div>

      <div className="md:col-span-2">
        <Label>Category Description</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </MasterFormLayout>
  );
}