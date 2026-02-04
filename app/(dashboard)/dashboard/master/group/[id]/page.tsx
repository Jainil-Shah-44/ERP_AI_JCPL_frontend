"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GroupMasterForm from "@/components/groupmaster/GroupMasterForm";
import {
  getGroups,
  updateGroup,
  GroupMaster,
} from "@/services/groupmaster.service";

export default function EditGroupMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<GroupMaster | null>(null);

  useEffect(() => {
    getGroups().then((list) => {
      setGroup(list.find((g) => g.id === id) || null);
    });
  }, [id]);

  if (!group) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Edit Item Group
      </h1>

      <GroupMasterForm
        initialData={group}
        onSubmit={async (data) => {
          await updateGroup(group.id, data);
          router.push("/dashboard/master/group");
        }}
      />
    </div>
  );
}
