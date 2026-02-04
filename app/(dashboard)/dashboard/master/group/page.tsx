"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  getGroups,
  deleteGroup,
  GroupMaster,
} from "@/services/groupmaster.service";

export default function GroupMasterListPage() {
  const [items, setItems] = useState<GroupMaster[]>([]);

  const load = async () => {
    setItems(await getGroups());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item group?")) return;
    await deleteGroup(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Item Group Master</h1>
        <Link href="/dashboard/master/group/create">
          <Button title="Add Group" />
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Group Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((g) => (
            <tr key={g.id}>
              <td className="border p-2">{g.name}</td>
              <td className="border p-2">{g.description || "-"}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/dashboard/master/group/${g.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>
                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(g.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
