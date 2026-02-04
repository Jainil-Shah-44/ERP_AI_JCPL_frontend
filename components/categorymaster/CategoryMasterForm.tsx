"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      await onSubmit({
        name,
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-xl">
      <div className="grid grid-cols-1 gap-6">
        {/* Category Name */}
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>

        {/* Category Description */}
        <div>
          <Label htmlFor="description">Category Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4 border-t pt-6">
        <Button
          title={loading ? "Saving..." : "Save"}
          variant="primary"
          className="sm"
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
        />
      </div>
    </div>
  );
}
