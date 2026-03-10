"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import Toast from "@/components/ui/Toast";

export default function Login() {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  const [companyCode, setCompanyCode] = useState("JEEVAN01");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔑 required for refresh_token cookie
        body: JSON.stringify({
          company_code: companyCode,
          username,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      // ✅ Store access token ONLY in memory
      setAccessToken(data.access_token);
      setToast(true);
      // 🔥 THIS WAS MISSING
      localStorage.setItem("access_token", data.access_token);

      // ✅ Show success toast on login page
      setShowSuccess(true);

      // ⏳ Redirect after short delay
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);
    } catch (err) {
      alert("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
      <img src='/logo.jpeg'/>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sign In</h2>

          <div className="mb-4">
            <Label>Company Code</Label>
            <Input
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              placeholder="JEEVAN01"
            />
          </div>

          <div className="mb-4">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            title={loading ? "Logging in..." : "Login"}
            variant="primary"
            fullWidth
            disabled={loading}
            onClick={handleLogin}
          />
        </div>
      </div>
      {toast && (
        <Toast
          msg="Logged in successfully"
          type="success"
          position="top-center"
          autoClose={2000}
        />
      )}
    </div>
  );
}
