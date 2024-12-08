import React, { Suspense } from 'react';
import Users from "@/app/dashboard/user/user-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Users />
    </Suspense>
  );
}
