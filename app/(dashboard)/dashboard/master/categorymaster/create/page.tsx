"use client";

import { useRouter } from "next/navigation";
import CategoryMasterForm from "@/components/categorymaster/CategoryMasterForm";
import { createCategory } from "@/services/categorymaster.service";

export default function CreateCategoryMasterPage() {
  const router = useRouter();

  return (
      <CategoryMasterForm
        onSubmit={async (data) => {
          await createCategory(data);
          router.push("/dashboard/master/categorymaster");
        }}
      />
  );
}
