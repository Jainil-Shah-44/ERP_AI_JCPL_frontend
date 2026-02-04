"use client";

import { useRouter } from "next/navigation";
import RawMaterialMasterForm from "@/components/rawmaterialmaster/RawMaterialMasterForm";
import { createRawMaterial } from "@/services/rawmaterialmaster.service";

export default function CreateRawMaterialMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Create Raw Material
      </h1>

      <RawMaterialMasterForm
        onSubmit={async (data) => {
          await createRawMaterial(data);
          router.push("/dashboard/master/rawmaterialmaster");
        }}
      />
    </div>
  );
}
