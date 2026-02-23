"use client";

import { useRouter } from "next/navigation";
import FactoryMasterForm from "@/components/factorymaster/FactoryMasterForm";
import { createFactory } from "@/services/factorymaster.service";

export default function CreateFactoryMasterPage() {
  const router = useRouter();

  return (
      <FactoryMasterForm
        onSubmit={async (data) => {
          await createFactory(data);
          router.push("/dashboard/master/factorymaster");
        }}
      />
  );
}
