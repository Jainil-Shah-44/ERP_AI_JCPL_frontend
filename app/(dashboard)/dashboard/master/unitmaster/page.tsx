"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getUnits,
  deleteUnit,
  UnitMaster,
} from "@/services/unitmaster.service";

export default function UnitMasterListPage() {
  const [items, setItems] = useState<UnitMaster[]>([]);

  const load = async () => {
    setItems(await getUnits());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this unit?")) return;
    await deleteUnit(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Unit Master</h1>
        <Link href="/dashboard/master/unitmaster/create">
          <Button title="Add Unit" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Unit Code</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Conversion Factor</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.unit_code}</td>
              <td className="border p-2">{u.description || "-"}</td>
              <td className="border p-2">
                {u.conversion_factor ?? "-"}
              </td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/unitmaster/${u.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(u.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
