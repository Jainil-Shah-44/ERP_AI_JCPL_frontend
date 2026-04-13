"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button";
import MasterFormLayout from "@/components/layout/MasterFormLayout";
import Toast from "@/components/ui/Toast";
import { Eye, EyeOff } from "lucide-react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { apiFetch } from "@/lib/api";

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
      factory_ids: [],
    },
  );

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] =
    useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [factories, setFactories] = useState<any[]>([]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    apiFetch("/roles")
      .then((data) => setRoles(data))
      .catch((err) => console.error("Failed to load roles", err));
  }, []);

  useEffect(() => {
    apiFetch("/masters/factories")
      .then((data) => setFactories(data))
      .catch((err) => console.error("Failed to load factories", err));
  }, []);

  useEffect(() => {
    if (["admin", "superadmin", "manager"].includes(form.role?.toLowerCase())) {
      setForm((prev: any) => ({
        ...prev,
        factory_ids: [],
      }));
    }
  }, [form.role]);

  useEffect(() => {
  if (!initialData) return;

  setForm({
    ...initialData,
    factory_ids: initialData.factory_ids || [],   // 🔥 THIS FIX
  });
}, [initialData]);
  /* ================= VALIDATION ================= */

  const validate = (): string | null => {
    if (!form.username.trim()) return "Username is required";

    if (!form.email.trim()) return "Email is required";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(form.email)) return "Enter valid email address";

    if (!form.mobile_number) return "Mobile number is required";

    if (!/^[0-9]{10}$/.test(form.mobile_number))
      return "Mobile number must be 10 digits";

    if (!form.role.trim()) return "Role is required";

    if (!form.location.trim()) return "Location is required";

    if (showPassword) {
      if (!form.password) return "Password is required";

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

      if (!passwordRegex.test(form.password))
        return "Password must be 8+ characters with letters and numbers";

      if (!form.confirm_password) return "Confirm password is required";

      if (form.password !== form.confirm_password)
        return "Password and confirm password do not match";
    }

    if (
      !["admin", "superadmin", "manager"].includes(form.role?.toLowerCase())
    ) {
      if (!form.factory_ids || form.factory_ids.length === 0) {
        return "At least one factory must be selected";
      }
    }

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
        title="User Master"
        description="Create and manage system users"
        actions={
          <Button
            title={loading ? "Saving..." : "Save User"}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        }
      >
        {/* Username */}
        <div>
          <Label>
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </div>

        {/* Email */}
        <div>
          <Label>
            Email <span className="text-red-500">*</span>
          </Label>
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
          <Label>
            Mobile Number <span className="text-red-500">*</span>
          </Label>
          <Input
            type="tel"
            name="mobile_number"
            value={form.mobile_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, mobile_number: value });
            }}
            placeholder="Enter mobile number"
            maxLength={10}
          />
        </div>

        {/* Role */}
        <div>
          <Label>
            Role <span className="text-red-500">*</span>
          </Label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Role</option>

            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* FACTORY MULTI SELECT */}
        {!["admin", "superadmin", "manager"].includes(
          form.role?.toLowerCase(),
        ) && (
          <div>
            <Label>
              Factories <span className="text-red-500">*</span>
            </Label>

            <div className="border rounded p-3 max-h-40 overflow-y-auto space-y-2">
              {factories.map((f) => (
                <label key={f.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.factory_ids || []).includes(String(f.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          factory_ids: [...form.factory_ids, String(f.id)],
                        });
                      } else {
                        setForm({
                          ...form,
                          factory_ids: form.factory_ids.filter(
                            (id: string) => id !== f.id,
                          ),
                        });
                      }
                    }}
                  />
                  {f.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <Label>
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>

        {/* Password */}
        {showPassword && (
          <div className="relative">
            <Label>
              Password <span className="text-red-500">*</span>
            </Label>

            <Input
              type={showPasswordField ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() => setShowPasswordField(!showPasswordField)}
            >
              {showPasswordField ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          </div>
        )}

        {showPassword && (
          <div className="relative">
            <Label>
              Confirm Password <span className="text-red-500">*</span>
            </Label>

            <Input
              type={showConfirmPasswordField ? "text" : "password"}
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="Confirm password"
            />

            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() =>
                setShowConfirmPasswordField(!showConfirmPasswordField)
              }
            >
              {showConfirmPasswordField ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          </div>
        )}
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
