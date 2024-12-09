"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { checkAdmin, loginRequest } from "@/app/api/auth";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "shareandcaret@gmail.com", // Điền sẵn email
    password: "ShareAndCare2024",     // Điền sẵn password
  });
  const router = useRouter();
  const { setIsLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(false);

    // Kiểm tra nếu email và password đã lưu trong localStorage
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
    if (savedPassword) {
      setFormData((prev) => ({ ...prev, password: savedPassword }));
    }
  }, [setIsLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading
    try {
      // Thực hiện đăng nhập
      const response = await loginRequest({
        email: formData.email,
        password: formData.password,
      });

      const currentTime = new Date().getTime();

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("tokenTimestamp", currentTime.toString());

      // Lưu email và password để điền tự động sau
      localStorage.setItem("email", formData.email);
      localStorage.setItem("password", formData.password);

      setIsLogin(true);

      // Kiểm tra nếu người dùng là admin
      const adminCheck = await checkAdmin(
        response.user.id,
        response.tokens.accessToken
      );

      if (Object.keys(adminCheck).length === 0) {
        toast.success("Login successful.");
        router.push("/dashboard");
      } else {
        toast.info("You are not an admin. Stay here.");
        router.push(`/?userId=${response.user.id}&refreshToken=${response.tokens.refreshToken}`);
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl w-full flex">
        {/* Left Section */}
        <div className="w-1/2 hidden md:block">
          <Image
            src="/Right_Side_Image.png"
            alt="Login Illustration"
            width={500}
            height={500}
            className="rounded-2xl object-cover h-full"
          />
        </div>
        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between px-6">
          <div className="text-center mb-6">
            <Image
              src="/logo.svg"
              alt="Share and Care Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
              Management System
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <Mail className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  className="w-full ml-3 text-sm text-gray-700 outline-none"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={formData.email} // Điền sẵn email
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <Lock className="text-gray-400" />
                <input
                  type="password"
                  name="password"
                  className="w-full ml-3 text-sm text-gray-700 outline-none"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password} // Điền sẵn password
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Links */}
            <div className="text-right mt-4">
              <Link href="/auth/forgot-password" className="text-[#2F8F8A] hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#38A59F] hover:bg-[#2F8F8A]"}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.292A7.964 7.964 0 014 12H2c0 2.042.765 3.899 2.034 5.292l2.006-1.706z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
