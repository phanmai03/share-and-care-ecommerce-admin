import React from 'react'
import Heading from '../ui/heading'
import LargeCards from '../ui/dashboard/largecards'
import SmallCards from '../ui/dashboard/smallcards'

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
