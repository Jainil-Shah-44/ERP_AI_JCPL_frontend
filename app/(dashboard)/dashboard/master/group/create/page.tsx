"use client";

import { useRouter } from "next/navigation";
import GroupMasterForm from "@/components/groupmaster/GroupMasterForm";
import { createGroup } from "@/services/groupmaster.service";

export default function CreateGroupMasterPage() {
  const router = useRouter();

  return (
    <GroupMasterForm
      onSubmit={async (data) => {
        await createGroup(data);
        router.push("/dashboard/master/group");
      }}
    />
  );
}