"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { changePassword } from "@/app/api/user";
import { useRouter } from "next/navigation"; // Dùng useRouter từ next/navigation

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Khởi tạo router từ next/navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId") || ""; // Lấy userId từ localStorage
      const accessToken = localStorage.getItem("accessToken") || ""; // Lấy accessToken từ localStorage

      if (!userId || !accessToken) {
        toast.error("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      await changePassword(formData, userId, accessToken);
      toast.success("Password changed successfully!");
      router.push("/dashboard"); // Chuyển hướng bằng useRouter từ next/navigation
      setFormData({ oldPassword: "", newPassword: "" });
    } catch {
      toast.error("Failed to change password. Please try again.");
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
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your old password"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your new password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium text-white bg-[#38A59F] hover:bg-[#2F8F8A] transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

          <button
            type="button"
            className="mt-4 w-full py-2 px-4 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => router.back()} // Điều hướng quay lại trang trước
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
