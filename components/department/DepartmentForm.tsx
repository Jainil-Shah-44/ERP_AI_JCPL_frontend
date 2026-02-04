"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";

type Props = {
  initialData?: {
    name: string;
    description?: string;
  };
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
};

export default function DepartmentForm({ initialData, onSubmit }: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit({ name, description });
    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 max-w-xl">
        <div>
          <Label>Department Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          title={loading ? "Saving..." : "Save"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </>
  );
}
