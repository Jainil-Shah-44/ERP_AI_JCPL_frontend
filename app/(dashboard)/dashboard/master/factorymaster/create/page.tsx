"use client";

import { useRouter } from "next/navigation";
import FactoryMasterForm from "@/components/factorymaster/FactoryMasterForm";
import { createFactory } from "@/services/factorymaster.service";

export default function CreateFactoryMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create Factory</h1>

      <FactoryMasterForm
        onSubmit={async (data) => {
          await createFactory(data);
          router.push("/dashboard/master/factorymaster");
        }}
      />
    </div>
  );
}
