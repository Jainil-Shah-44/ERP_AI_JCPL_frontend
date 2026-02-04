"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryMasterForm from "@/components/categorymaster/CategoryMasterForm";
import {
  getCategories,
  updateCategory,
} from "@/services/categorymaster.service";

export default function EditCategoryMasterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    getCategories().then((list) => {
      setItem(list.find((c) => c.id === id));
    });
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Category</h1>

      <CategoryMasterForm
        initialData={item}
        onSubmit={async (data) => {
          await updateCategory(item.id, data);
          router.push("/dashboard/master/categorymaster");
        }}
      />
    </div>
  );
}
