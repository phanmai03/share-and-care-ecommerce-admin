import React, { Suspense } from 'react';
import Create from "@/app/dashboard/delivery/create/create-form";

export default function Page() {
  return (
    // Wrap the Create component with Suspense to handle async operations (like useSearchParams)
    <Suspense fallback={<div>Loading...</div>}>
      <Create />
    </Suspense>
  );
}
