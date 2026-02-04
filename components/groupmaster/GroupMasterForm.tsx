"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GroupFormData = {
  name: string;
  description?: string;
};

type Props = {
  initialData?: GroupFormData;
  onSubmit: (data: GroupFormData) => Promise<void>;
};

export default function GroupMasterForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<GroupFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
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
          <Label>Item Group Master</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Item Description</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
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
