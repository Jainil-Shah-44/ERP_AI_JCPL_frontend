"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RawMaterialMasterForm from "@/components/rawmaterialmaster/RawMaterialMasterForm";
import {
  getRawMaterials,
  updateRawMaterial,
  RawMaterialMaster,
} from "@/services/rawmaterialmaster.service";

export default function EditRawMaterialMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [material, setMaterial] = useState<RawMaterialMaster | null>(null);

  useEffect(() => {
    getRawMaterials().then((list) => {
      setMaterial(list.find((m) => m.id === id) || null);
    });
  }, [id]);

  if (!material) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Edit Raw Material
      </h1>

      <RawMaterialMasterForm
        initialData={material}
        onSubmit={async (data) => {
          await updateRawMaterial(material.id, data);
          router.push("/dashboard/master/rawmaterialmaster");
        }}
      />
    </div>
  );
}
