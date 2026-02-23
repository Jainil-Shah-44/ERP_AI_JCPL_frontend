"use client";

import { useRouter } from "next/navigation";
import RawMaterialMasterForm from "@/components/rawmaterialmaster/RawMaterialMasterForm";
import { createRawMaterial } from "@/services/rawmaterialmaster.service";

export default function CreateRawMaterialMasterPage() {
  const router = useRouter();

  return (
    <RawMaterialMasterForm
      onSubmit={async (data) => {
        await createRawMaterial(data);
        router.push("/dashboard/master/rawmaterialmaster");
      }}
    />
  );
}