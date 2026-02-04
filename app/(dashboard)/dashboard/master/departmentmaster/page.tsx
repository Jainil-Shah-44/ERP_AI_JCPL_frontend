"use client";

import { useEffect, useState } from "react";
import {
  getDepartments,
  deleteDepartment,
  Department,
} from "@/services/department.service";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function DepartmentListPage() {
  const [items, setItems] = useState<Department[]>([]);

  const load = async () => {
    setItems(await getDepartments());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;
    await deleteDepartment(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Departments</h1>
        <Link href="/dashboard/master/departmentmaster/create">
          <Button title="Add Department" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.id}>
              <td className="border p-2">{d.name}</td>
              <td className="border p-2">{d.description || "-"}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/departmentmaster/${d.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(d.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
