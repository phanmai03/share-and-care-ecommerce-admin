import React, { useState, useEffect } from "react";
import { AlignJustify } from "lucide-react";
import { Menu } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { logoutRequest } from "@/app/api/auth";
import Image from "next/image";

interface NavbarProps {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setShowSidebar }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken"));
      setUserId(searchParams?.get("userId") || localStorage.getItem("userId"));
      setAvatarUrl(localStorage.getItem("avatarUrl"));
      setRole(localStorage.getItem("role"));
    }
  }, [searchParams]);

  const handleLogout = async () => {
    if (!accessToken || !userId) {
      toast.error("Access token or user ID is not available.");
      return;
    }
    try {
      await logoutRequest(userId, accessToken);
      toast.success("Logout successful.");
      localStorage.clear(); // Clear all localStorage data
      router.push("/auth/login");
    } catch {
      toast.error("An error occurred during logout.");
    }
  };

  const handleProfileClick = () => router.push("/auth/profile");
  const handlePasswordUpdate = () => router.push("/auth/update-password");

  return (
    <div className="flex items-center justify-between lg:justify-end bg-[#38A59F] text-black h-20 fixed top-0 w-full px-4 lg:px-8 z-50 shadow-md">
      {/* Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar((prev) => !prev)}
        className="lg:hidden text-neutral-700 dark:text-neutral-950 focus:outline-none"
      >
        <AlignJustify size={24} />
      </button>

      {/* Right Section */}
      <div className="flex items-center space-x-4 lg:space-x-6 fixed right-5">
        <Menu as="div" className="relative">
          <Menu.Button className="rounded-full overflow-hidden w-8 h-8 focus:outline-none border-2 border-white flex items-center justify-center">
            <Image
              src={avatarUrl || "/profile.png"}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
              width={40}
              height={40}
            />
          </Menu.Button>
          {role && (
            <p className="text-xs text-gray-200 mt-1 text-center">
              {role}
            </p>
          )}
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg focus:outline-none border">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  onClick={handlePasswordUpdate}
                >
                  Update Password
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
