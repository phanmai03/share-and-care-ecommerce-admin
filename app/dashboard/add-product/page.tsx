import React, { Suspense } from 'react';
import Add from "@/app/dashboard/add-product/add-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Add/>
    </Suspense>
  );
}
