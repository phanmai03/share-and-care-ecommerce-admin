"use client";

import "@/app/ui/globals.css";
import { lusitana } from "@/app/ui/fonts";
import Sidebar from "./ui/sidebar";
import Navbar from "./ui/navbar";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

          <div className="lg:ml-60 ml-0 flex-grow bg-slate-100 min-h-screen">
            {/* Navbar */}
            <Navbar setShowSidebar={setShowSidebar} />

            {/* Main Content */}
            <main className="p-8 bg-[#F1F6F9] text-black min-h-screen mt-16">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
