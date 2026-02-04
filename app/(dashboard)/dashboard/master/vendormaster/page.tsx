"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getVendors,
  deleteVendor,
  VendorMaster,
} from "@/services/vendormaster.service";

export default function VendorMasterListPage() {
  const [items, setItems] = useState<VendorMaster[]>([]);

  const load = async () => {
    setItems(await getVendors());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vendor?")) return;
    await deleteVendor(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Vendor Master</h1>
        <Link href="/dashboard/master/vendormaster/create">
          <Button title="Add Vendor" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Vendor Name</th>
            <th className="border p-2">Mobile 1</th>
            <th className="border p-2">GST</th>
            <th className="border p-2">State</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.id}>
                <td className="border p-2">{v.name}</td>
              <td className="border p-2">{v.mobile_number1 || "-"}</td>
              <td className="border p-2">{v.gst_number || "-"}</td>
              <td className="border p-2">{v.state || "-"}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/vendormaster/${v.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(v.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
