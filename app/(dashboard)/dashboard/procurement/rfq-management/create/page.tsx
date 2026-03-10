// page.tsx

import { Suspense } from "react";
import CreateRFQ from "./CreateRFQ";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateRFQ />
    </Suspense>
  );
}