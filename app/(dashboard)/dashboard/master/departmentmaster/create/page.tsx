"use client";

import { useRouter } from "next/navigation";
import DepartmentForm from "@/components/department/DepartmentForm";
import { createDepartment } from "@/services/department.service";

export default function CreateDepartmentPage() {
  const router = useRouter();

  return (
      <DepartmentForm
        onSubmit={async (data) => {
          await createDepartment(data);
          router.push("/dashboard/master/departmentmaster");
        }}
      />
  );
}
