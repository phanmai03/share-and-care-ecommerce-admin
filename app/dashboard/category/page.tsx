import React, { Suspense } from 'react';
import Categories from "@/app/dashboard/category/category-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Categories />
    </Suspense>
  );
}
