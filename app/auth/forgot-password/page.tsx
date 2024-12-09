"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { updatePassword } from '@/app/api/auth';

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      email: e.target.value,
    });
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevents default behavior (in case it's within a form)
    setLoading(true);
    
    try {
      // Truyền đúng dữ liệu vào API
      const data = {
        email: formData.email,
        isPanel: true, // Thêm giá trị isPanel
      };
      
      await updatePassword(data); // Gọi API với dữ liệu đúng
      
      toast.success("A reset password email has been sent to your inbox. Please check your email to receive password reset instructions.");
    } catch {
      toast.error("There was an error sending the reset link. Please try again.");
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
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Update Password?</h2>
          <p className="text-sm text-gray-500 mt-2">
            {/* Enter your registered email address and we’ll send you a reset link. */}
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              className="w-full ml-3 text-sm text-gray-700 outline-none"
              placeholder="Enter your email"
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
           onClick={handleClick}
          className={`w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-[#38A59F] hover:bg-[#2F8F8A] transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 animate-spin" />}
          {loading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <div className="text-center mt-4">  
          <Link href="/dashboard" className="text-[#38A59F] hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
