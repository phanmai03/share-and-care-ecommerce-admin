"use client";

import "@/app/ui/globals.css";
import { lusitana } from "@/app/ui/fonts";
import { AuthProvider } from "./context/AuthContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AuthProvider>
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>{children}
      </body>
    </html>
    </AuthProvider>
  );
}


