import React, { Suspense } from 'react'
import Heading from '@/app/ui/heading'
// import LargeCards from '@/app/ui/dashboard/largecards'
// import SmallCards from '@/app/ui/dashboard/smallcards'
import Statics from '@/app/ui/dashboard/statics'
export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <div>
      <Heading title='Dashboard Overview'/>
      {/* Large Cards */}
      {/* <LargeCards/> */}
      {/* Small cards */}
      {/* <SmallCards /> */}
      {/* Charts */}
      {/* Recent Order Table */}
      <Statics/>
    </div>
    </Suspense>
  )
}
