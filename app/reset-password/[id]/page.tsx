"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { resetPassword } from "@/app/api/auth";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const resetToken = pathName.split("/").pop();

  const [formData, setFormData] = useState({
    resetToken: resetToken || "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(formData);
      toast.success("Your password has been updated successfully. Please log in again.");
      router.push("/auth/login");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <Image
            src="/logo.svg"
            alt="Share and Care Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">New Password</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter a new password for your account below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="w-full text-sm text-gray-700 outline-none"
                placeholder="Enter your new password..."
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-[#38A59F] hover:bg-[#2F8F8A] transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && <FaSpinner className="mr-2 animate-spin" />}
            {loading ? "Confirm Password..." : "Confirm Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
