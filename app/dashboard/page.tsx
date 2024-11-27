import React from 'react'
import Heading from '@/app/ui/heading'
import LargeCards from '@/app/ui/dashboard/largecards'
import SmallCards from '@/app/ui/dashboard/smallcards'

export default function page() {
  return (
    <div>
      <Heading title='Dashboard Overview'/>
      {/* Large Cards */}
      <LargeCards/>
      {/* Small cards */}
      <SmallCards />
      {/* Charts */}
      {/* Recent Order Table */}
    </div>
  )
}
