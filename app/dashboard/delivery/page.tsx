import React, { Suspense } from 'react';
import Delivery from "@/app/dashboard/delivery/delvery-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Delivery />
    </Suspense>
  );
}
