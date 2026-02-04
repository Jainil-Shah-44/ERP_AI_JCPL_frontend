"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getWarehouses,
  deleteWarehouse,
  WarehouseMaster,
} from "@/services/warehousemaster.service";

export default function WarehouseMasterListPage() {
  const [items, setItems] = useState<WarehouseMaster[]>([]);

  const load = async () => {
    setItems(await getWarehouses());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this warehouse?")) return;
    await deleteWarehouse(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Warehouse Master</h1>
        <Link href="/dashboard/master/warehousemaster/create">
          <Button title="Add Warehouse" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">State</th>
            <th className="border p-2">Incharge</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.id}>
              <td className="border p-2">{w.name}</td>
              <td className="border p-2">{w.location || "-"}</td>
              <td className="border p-2">{w.state || "-"}</td>
              <td className="border p-2">{w.incharge || "-"}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/warehousemaster/${w.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(w.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
