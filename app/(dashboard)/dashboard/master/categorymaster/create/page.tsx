"use client";

import { useRouter } from "next/navigation";
import CategoryMasterForm from "@/components/categorymaster/CategoryMasterForm";
import { createCategory } from "@/services/categorymaster.service";

export default function CreateCategoryMasterPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create Category</h1>

      <CategoryMasterForm
        onSubmit={async (data) => {
          await createCategory(data);
          router.push("/dashboard/master/categorymaster");
        }}
      />
    </div>
  );
}
