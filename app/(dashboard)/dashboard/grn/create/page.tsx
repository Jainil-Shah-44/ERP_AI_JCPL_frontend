"use client";

import { useRouter } from "next/navigation";
import GRNForm from "@/components/grn/GRNForm";
import { createGRN, submitGRN } from "@/services/grn.service";

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (data: any, submit?: boolean) => {
    const res = await createGRN(data);

    if (submit) {
      await submitGRN(res.id);
    }

    router.push(`/dashboard/grn/${res.id}`);
  };

  return (
    <div>
      <h1 className="text-xl mb-4">Create GRN</h1>
      <GRNForm onSubmit={handleSubmit} />
    </div>
  );
}