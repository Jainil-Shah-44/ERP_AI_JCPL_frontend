"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/users/UserForm";
import { getUserById, updateUser } from "@/services/user.service";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUserById(id as string).then(setUser);
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit User</h1>
      <UserForm
        initialData={user}
        showPassword={false}
        onSubmit={async (data) => {
          await updateUser(user.id, data);
          router.push("/dashboard/master/usermaster");
        }}
      />
    </div>
  );
}
