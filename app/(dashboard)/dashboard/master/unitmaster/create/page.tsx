"use client";

import { useRouter } from "next/navigation";
import UnitMasterForm from "@/components/unitmaster/UnitMasterForm";
import { createUnit } from "@/services/unitmaster.service";

export default function CreateUnitMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Create Unit
      </h1>

      <UnitMasterForm
        onSubmit={async (data) => {
          await createUnit(data);
          router.push("/dashboard/master/unitmaster");
        }}
      />
    </div>
  );
}
