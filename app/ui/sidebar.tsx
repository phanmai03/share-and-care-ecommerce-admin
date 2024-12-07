import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../public/logo.svg";
import {
  LayoutGrid,
  Users2,
  UserSquare2,
  Mail,
  TicketPercent,
  MessagesSquare,
  ShoppingBasket,
  ChartNoAxesCombined,
  HousePlus,
  Settings,
  ListTodo,
  Truck,
  ShoppingBag
} from "lucide-react";

// Type the props for Sidebar component
interface SidebarProps {
  showSidebar: boolean; // Type for showSidebar prop
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>; // Type for setShowSidebar function
}

const Sidebar: React.FC<SidebarProps> = ({ showSidebar, setShowSidebar }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    { title: "Dashboard", icon: ChartNoAxesCombined, href: "/dashboard" },
    { title: "Category", icon: LayoutGrid, href: "/dashboard/category" },
    { title: "Add Product", icon: HousePlus, href: "/dashboard/add-product" },
    { title: "All Product", icon: ShoppingBasket, href: "/dashboard/all-product" },
    // { title: "Email", icon: Mail, href: "/dashboard/email" },
    { title: "Coupon", icon: TicketPercent, href: "/dashboard/coupon" },
    // { title: "Feedback", icon: MessagesSquare, href: "/dashboard/feedback" },
    // { title: "Blog", icon: ListTodo, href: "/dashboard/blog" },
    // { title: "Seller", icon: UserSquare2, href: "/dashboard/seller" },
    { title: "User", icon: Users2, href: "/dashboard/user" },
    { title: "Delivery", icon: Truck, href: "/dashboard/delivery" },
    { title: "Orders", icon: ShoppingBag, href: "/dashboard/orders" },
    // { title: "Return Policy", icon: Settings, href: "/dashboard/return-policy" },
  ];



  return (
    <div
  className={`${
    showSidebar ? "block" : "hidden"
  } sm:mt-0 bg-white space-y-6 w-60 h-screen text-lg fixed left-0 min-[0px]:top-20 lg:top-0 shadow-md z-40`}
>
      <div className="px-6 py-4">
        <Link href="#">
          <Image src={logo} alt="Share and Care" className="w-36" />
        </Link>
      </div>

      <div className="space-y-3 flex flex-col">
        {sidebarLinks.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            onClick={() => setShowSidebar(true)} // Close sidebar on link click
            className={`flex items-center space-x-3 px-6 py-2 hover:border-green-600 hover:bg-gray-100 transition-all ${
              pathname === item.href ? "bg-gray-100" : ""
            }`}
          >
            <item.icon size={24} />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
