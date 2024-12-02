"use client";

import "@/app/ui/globals.css";
import { lusitana } from "@/app/ui/fonts";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AuthProvider>
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>
        {children}
        <ToastContainer/>
      </body>
    </html>
    </AuthProvider>
  );
}


