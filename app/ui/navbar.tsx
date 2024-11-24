import React from "react";
import { AlignJustify, Bell } from "lucide-react";
import Image from "next/image";

// Only keep setShowSidebar in the props
interface NavbarProps {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>; // Type for setter function
}

const Navbar: React.FC<NavbarProps> = ({ setShowSidebar }) => {
  return (
    <div className="flex items-center justify-between bg-[#38A59F] text-black h-20 py-8 fixed top-0 w-full px-8 z-50">
      {/* Toggle Sidebar visibility */}
      <button
        onClick={() => setShowSidebar((prev) => !prev)} // Toggle state
        className="text-neutral-700 dark:text-neutral-950"
      >
        <AlignJustify />
      </button>

      {/* Add icons with responsive visibility */}
      <div className="flex space-x-3">
        {/* Notification Button */}
        <button
          type="button"
          className="relative inline-flex items-center p-3 text-sm font-medium text-center text-black bg-transparent rounded-lg"
        >
          <Bell />
          <span className="sr-only">Notification</span>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
            20
          </div>
        </button>

        {/* Profile Image */}
        <button>
          <Image
            src="/profile.png"
            alt="User profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            onError={(e) => (e.currentTarget.src = "/default-profile.png")} // Fallback image
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
