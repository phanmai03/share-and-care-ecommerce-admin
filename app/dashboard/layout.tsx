"use client";

import "@/app/ui/globals.css";
import Sidebar from "@/app/ui/sidebar";
import Navbar from "@/app/ui/navbar";
import { useState } from "react";
import { AuthProvider } from "@/app/context/AuthContext"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <AuthProvider>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <div className="lg:ml-60 ml-0 flex-grow bg-slate-100 min-h-screen">
          {/* Navbar */}
          <Navbar setShowSidebar={setShowSidebar} />

          {/* Main Content */}
          <div className="p-8 bg-[#F1F6F9] text-black min-h-screen mt-16">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
