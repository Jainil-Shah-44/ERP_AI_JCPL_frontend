"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

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
      title="Department Master"
      description="Create and manage departments"
      actions={
        <Button
          title={loading ? "Saving..." : "Save Department"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
        />
      }
    >
      <div>
        <Label>Department Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter department name"
        />
      </div>

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
  );
}