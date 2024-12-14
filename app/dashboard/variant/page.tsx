import React, { Suspense } from 'react';
import Variant from "@/app/dashboard/variant/variant-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Variant />
    </Suspense>
  );
}
