"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FactoryMasterForm from "@/components/factorymaster/FactoryMasterForm";
import {
  getFactories,
  updateFactory,
  FactoryMaster,
} from "@/services/factorymaster.service";

export default function EditFactoryMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<FactoryMaster | null>(null);

  useEffect(() => {
    getFactories().then((list) => {
      setItem(list.find((f) => f.id === id) || null);
    });
  }, [id]);

  if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Factory</h1>

      <FactoryMasterForm
        initialData={item}
        onSubmit={async (data) => {
          await updateFactory(item.id, data);
          router.push("/dashboard/master/factorymaster");
        }}
      />
    </div>
  );
}
