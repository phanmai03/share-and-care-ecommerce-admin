import React, { Suspense } from 'react';
import Orders from "@/app/dashboard/orders/order-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Orders />
    </Suspense>
  );
}
