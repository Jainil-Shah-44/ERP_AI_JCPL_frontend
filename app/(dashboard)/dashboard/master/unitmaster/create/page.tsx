"use client";

import { useRouter } from "next/navigation";
import UnitMasterForm from "@/components/unitmaster/UnitMasterForm";
import { createUnit } from "@/services/unitmaster.service";

export default function CreateUnitMasterPage() {
  const router = useRouter();

  return (
    <UnitMasterForm
      onSubmit={async (data) => {
        await createUnit(data);
        router.push("/dashboard/master/unitmaster");
      }}
    />
  );
}