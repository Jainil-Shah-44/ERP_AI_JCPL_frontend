"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import {
  getGroups,
  deleteGroup,
  GroupMaster,
} from "@/services/groupmaster.service";
import DataTable from "@/components/layout/DataTable";

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
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Item Group Master</h1>

        <Link href="/dashboard/master/group/create">
          <Button title="Add Group" />
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        pageSize={5}
        columns={[
          {
            header: "Group Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Description",
            accessor: "description",
            sortable: true,
            render: (row) => row.description || "-",
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="flex gap-2">
                <Link href={`/dashboard/master/group/${row.id}`}>
                  <Button title="Edit" variant="secondary" />
                </Link>

                <Button
                  title="Delete"
                  variant="danger"
                  onClick={() => handleDelete(row.id)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}