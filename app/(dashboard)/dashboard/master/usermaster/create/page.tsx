"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/components/users/UserForm";
import { createUser } from "@/services/user.service";

export default function CreateUserPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create User</h1>

      <UserForm
        onSubmit={async (data) => {
          await createUser(data);
          router.push("/dashboard/master/usermaster"); // ✅ redirect
        }}
      />
    </div>
  );
}
