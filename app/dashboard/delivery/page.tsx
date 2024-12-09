import React, { Suspense } from 'react';
import Delivery from "@/app/dashboard/delivery/delivery-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Delivery />
    </Suspense>
  );
}
