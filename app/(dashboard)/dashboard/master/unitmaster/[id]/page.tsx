"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UnitMasterForm from "@/components/unitmaster/UnitMasterForm";
import {
  getUnits,
  updateUnit,
  UnitMaster,
} from "@/services/unitmaster.service";

export default function EditUnitMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [unit, setUnit] = useState<UnitMaster | null>(null);

  useEffect(() => {
    getUnits().then((list) => {
      setUnit(list.find((u) => u.id === id) || null);
    });
  }, [id]);

  if (!unit) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Edit Unit
      </h1>

      <UnitMasterForm
        initialData={unit}
        onSubmit={async (data) => {
          await updateUnit(unit.id, data);
          router.push("/dashboard/master/unitmaster");
        }}
      />
    </div>
  );
}
