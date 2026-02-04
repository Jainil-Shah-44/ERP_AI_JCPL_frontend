"use client";

import { useRouter } from "next/navigation";
import GroupMasterForm from "@/components/groupmaster/GroupMasterForm";
import { createGroup } from "@/services/groupmaster.service";

export default function CreateGroupMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Create Item Group
      </h1>

      <GroupMasterForm
        onSubmit={async (data) => {
          await createGroup(data);
          router.push("/dashboard/master/group");
        }}
      />
    </div>
  );
}
