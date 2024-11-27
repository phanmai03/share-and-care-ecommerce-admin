import React from "react";
import { AlignJustify, Bell } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setShowSidebar }) => {
  return (
    <div className="flex items-center min-[0px]:justify-between lg:justify-end bg-[#38A59F] text-black h-20 fixed  top-0 w-full px-4 lg:px-8 z-50">
      {/* Sidebar Toggle (Visible on small screens) */}
      <button
        onClick={() => setShowSidebar((prev) => !prev)}
        className="lg:hidden text-neutral-700 dark:text-neutral-950"
      >
        <AlignJustify size={24} />
      </button>

      {/* Right Section: Notification & Profile */}
      <div className="flex items-center space-x-4 lg:space-x-6 fixed right-5">
        {/* Notification Button */}
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-white/10 transition"
        >
          <Bell className="w-6 h-6" />
          <span className="sr-only">Notification</span>
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
            20
          </div>
        </button>

        {/* Profile Image */}
        <button className="rounded-full overflow-hidden w-8 h-8">
          <Image
            src="/profile.png"
            alt="User profile"
            width={32}
            height={32}
            className="object-cover"
            onError={(e) => (e.currentTarget.src = "/default-profile.png")}
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
