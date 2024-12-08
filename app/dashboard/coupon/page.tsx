import React, { Suspense } from 'react';
import Coupons from "@/app/dashboard/coupon/coupons-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Coupons />
    </Suspense>
  );
}
