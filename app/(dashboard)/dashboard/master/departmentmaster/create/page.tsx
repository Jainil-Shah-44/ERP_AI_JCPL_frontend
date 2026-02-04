"use client";

import { useRouter } from "next/navigation";
import DepartmentForm from "@/components/department/DepartmentForm";
import { createDepartment } from "@/services/department.service";

export default function CreateDepartmentPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create Department</h1>
      <DepartmentForm
        onSubmit={async (data) => {
          await createDepartment(data);
          router.push("/dashboard/master/departmentmaster");
        }}
      />
    </div>
  );
}
