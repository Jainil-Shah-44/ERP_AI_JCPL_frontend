"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getCategories,
  deleteCategory,
  CategoryMaster,
} from "@/services/categorymaster.service";

export default function CategoryMasterListPage() {
  const [items, setItems] = useState<CategoryMaster[]>([]);

  const load = async () => {
    setItems(await getCategories());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Category Master</h1>
        <Link href="/dashboard/master/categorymaster/create">
          <Button title="Add Category" />
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
          {items.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.description || "-"}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/categorymaster/${c.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(c.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
