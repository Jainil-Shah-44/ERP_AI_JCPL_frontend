"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getRawMaterials,
  deleteRawMaterial,
  RawMaterialMaster,
} from "@/services/rawmaterialmaster.service";

export default function RawMaterialMasterListPage() {
  const [items, setItems] = useState<RawMaterialMaster[]>([]);

  const load = async () => {
    setItems(await getRawMaterials());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this raw material?")) return;
    await deleteRawMaterial(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Raw Material Master</h1>
        <Link href="/dashboard/master/rawmaterialmaster/create">
          <Button title="Add Material" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{m.material_code}</td>
              <td className="border p-2">{m.material_name}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/rawmaterialmaster/${m.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(m.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
