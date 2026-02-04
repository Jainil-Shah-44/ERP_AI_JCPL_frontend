"use client";

import { useEffect, useState } from "react";
import { getUsers, deactivateUser, User } from "@/services/user.service";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    setUsers(await getUsers());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!confirm("Deactivate this user?")) return;
    await deactivateUser(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <Link href="/dashboard/master/usermaster/create">
          <Button title="Create User" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email || "-"}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/usermaster/${u.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Deactivate"
                  variant="danger"
                  onClick={() => handleDeactivate(u.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
