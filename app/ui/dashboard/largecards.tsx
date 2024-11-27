import React from 'react'
import LargeCard from './largecard'

interface OrderStats {
    period: string;
    sales: number;
    color: string;
  }
  
  export default function LargeCards() {
    const orderStats: OrderStats[] = [
      {
        period: "Today Orders",
        sales: 110000,
        color: "bg-green-600",
      },
      {
        period: "Yesterday Orders",
        sales: 130000,
        color: "bg-blue-600",
      },
      {
        period: "This Month",
        sales: 3000000,
        color: "bg-orange-600",
      },
      {
        period: "All-Time Sales",
        sales: 5000000,
        color: "bg-purple-600",
      },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
        {orderStats.map((item, i) => (
          <LargeCard
            data={item}
            key={i}
          />
        ))}
      </div>
    );
  }
  