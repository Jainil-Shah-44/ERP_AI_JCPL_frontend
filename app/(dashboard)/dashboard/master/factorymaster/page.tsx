"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getFactories,
  deleteFactory,
  FactoryMaster,
} from "@/services/factorymaster.service";

export default function FactoryMasterListPage() {
  const [items, setItems] = useState<FactoryMaster[]>([]);

  const load = async () => {
    setItems(await getFactories());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this factory?")) return;
    await deleteFactory(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Factory Master</h1>
        <Link href="/dashboard/master/factorymaster/create">
          <Button title="Add Factory" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Location Name</th>
            <th className="border p-2">Contact Person</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr key={f.id}>
              <td className="border p-2">{f.name}</td>
              <td className="border p-2">{f.incharge_name || "-"}</td>
              <td className="border p-2">{f.mobile_number || "-"}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/factorymaster/${f.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(f.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
