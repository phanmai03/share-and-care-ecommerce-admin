import React, { Suspense } from 'react'
import Role from "@/app/dashboard/role/role-form"

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Role />
    </Suspense>
  )
}
