import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../public/logo.svg";
import {
  LayoutGrid,
  Users2,
  TicketPercent,
  ShoppingBasket,
  ChartNoAxesCombined,
  HousePlus,
  Truck,
  ShoppingBag,
  UserRoundCog,
  Package,
} from "lucide-react";

// Type the props for Sidebar component
interface SidebarProps {
  showSidebar: boolean; // Type for showSidebar prop
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>; // Type for setShowSidebar function
}

const Sidebar: React.FC<SidebarProps> = ({ showSidebar, setShowSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarLinks = [
    { title: "Dashboard", icon: ChartNoAxesCombined, href: "/dashboard" },
    { title: "Category", icon: LayoutGrid, href: "/dashboard/category" },
    { title: "Add Product", icon: HousePlus, href: "/dashboard/add-product" },
    { title: "All Product", icon: ShoppingBasket, href: "/dashboard/all-product" },
    { title: "Coupon", icon: TicketPercent, href: "/dashboard/coupon" },
    { title: "User", icon: Users2, href: "/dashboard/user" },
    { title: "Delivery", icon: Truck, href: "/dashboard/delivery" },
    { title: "Orders", icon: ShoppingBag, href: "/dashboard/orders" },
    { title: "Role", icon: UserRoundCog, href: "/dashboard/role" },
    { title: "Variant", icon: Package, href: "/dashboard/variant" },
  ];

  const handleLogoClick = () => {
    router.push("/dashboard");
  };

  return (
    <div
      className={`${
        showSidebar ? "block" : "hidden"
      } sm:mt-0 bg-white space-y-6 w-60 h-screen text-lg fixed left-0 min-[0px]:top-20 lg:top-0 shadow-md z-40`}
    >
      {/* Logo Section */}
      <div className="px-6 py-4">
        <Image
          src={logo}
          alt="Share and Care"
          className="w-36 cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>

      {/* Sidebar Links */}
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