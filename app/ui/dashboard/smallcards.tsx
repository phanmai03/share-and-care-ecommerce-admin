import React from "react";
import { CheckCheck, Loader2, RefreshCcw, ShoppingCart } from "lucide-react";
import SmallCard from "./smallcard";

export default function SmallCards() {
  const orderStatus = [
    {
      title: "Total Orders", // Fixed property name from `period` to `title`
      number: 150,
      iconBg: "bg-green-600",
      icon: ShoppingCart,
    },
    {
      title: "Orders Pending",
      number: 100,
      iconBg: "bg-blue-600",
      icon: Loader2,
    },
    {
      title: "Order Processing",
      number: 200,
      iconBg: "bg-orange-600",
      icon: RefreshCcw,
    },
    {
      title: "Orders Delivered",
      number: 300,
      iconBg: "bg-purple-600",
      icon: CheckCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
      {orderStatus.map((data, i) => (
        <SmallCard data={data} key={i} />
      ))}
    </div>
  );
}
