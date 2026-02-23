"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";
import MasterFormLayout from "@/components/layout/MasterFormLayout";

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
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MasterFormLayout
      title="User Master"
      description="Create and manage system users"
      actions={
        <Button
          title={loading ? "Saving..." : "Save User"}
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !form.username?.trim()}
        />
      }
    >
      {/* Username */}
      <div>
        <Label>Username</Label>
        <Input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>

      {/* Mobile */}
      <div>
        <Label>Mobile Number</Label>
        <Input
          type="text"
          name="mobile_number"
          value={form.mobile_number}
          onChange={handleChange}
          placeholder="Enter mobile number"
        />
      </div>

      {/* Role */}
      <div>
        <Label>Role</Label>
        <Input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Enter role"
        />
      </div>

      {/* Location */}
      <div>
        <Label>Location</Label>
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Enter location"
        />
      </div>

      {/* Password */}
      {showPassword && (
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>
      )}
    </MasterFormLayout>
  );
}