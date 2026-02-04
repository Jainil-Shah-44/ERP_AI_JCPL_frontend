"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";

type Props = {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  showPassword?: boolean;
};

export default function UserForm({
  initialData,
  onSubmit,
  showPassword = true,
}: Props) {
  const [form, setForm] = useState(
    initialData || {
      username: "",
      email: "",
      mobile_number: "",
      role: "",
      location: "",
      password: "",
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      alert("Saved successfully");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Username</Label>
          <Input name="username" value={form.username} onChange={handleChange} />
        </div>

        <div>
          <Label>Email</Label>
          <Input name="email" value={form.email} onChange={handleChange} />
        </div>

        <div>
          <Label>Mobile Number</Label>
          <Input name="mobile_number" value={form.mobile_number} onChange={handleChange} />
        </div>

        <div>
          <Label>Role</Label>
          <Input name="role" value={form.role} onChange={handleChange} />
        </div>

        <div>
          <Label>Location</Label>
          <Input name="location" value={form.location} onChange={handleChange} />
        </div>

        {showPassword && (
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          title={loading ? "Saving..." : "Save"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </>
  );
}
