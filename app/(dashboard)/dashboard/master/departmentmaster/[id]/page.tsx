"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DepartmentForm from "@/components/department/DepartmentForm";
import { getDepartments, updateDepartment } from "@/services/department.service";

export default function EditDepartmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    getDepartments().then((list) => {
      setItem(list.find((d) => d.id === id));
    });
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Department</h1>
      <DepartmentForm
        initialData={item}
        onSubmit={async (data) => {
          await updateDepartment(item.id, data);
          router.push("/dashboard/master/departmentmaster");
        }}
      />
    </div>
  );
}
