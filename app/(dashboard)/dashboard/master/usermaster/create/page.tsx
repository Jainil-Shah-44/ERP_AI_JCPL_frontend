"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/components/users/UserForm";
import { createUser } from "@/services/user.service";

export default function CreateUserPage() {
  const router = useRouter();

  return (
      <UserForm
        onSubmit={async (data) => {
          await createUser(data);
          router.push("/dashboard/master/usermaster"); // ✅ redirect
        }}
      />
  );
}
