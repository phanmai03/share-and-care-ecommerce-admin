"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { checkAdmin, loginRequest, } from "@/app/api/auth";
import { useAuth } from "@/app/context/AuthContext";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();
    const { setIsLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [accessAdmin, setaccessAdmin] = useState({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            // Attempt to log in
            const response = await loginRequest({
                email: formData.email,
                password: formData.password,
            });

            // Save tokens in sessionStorage
            sessionStorage.setItem("accessToken", response.tokens.accessToken);
            sessionStorage.setItem("refreshToken", response.tokens.refreshToken);
            setIsLogin(true);

            // Check if the user is an admin
            const adminCheck = await checkAdmin(
                response.user.id,  // Use user.id instead of clientId
                response.tokens.accessToken
            );
            setaccessAdmin(adminCheck)

            if (Object.keys(accessAdmin).length === 0) {
                toast.success("Login successful.");
                // Redirect to admin panel if the user is an admin
                
                router.push("/dashboard");
            } else {
                // Stay on the current page if the user is not an admin
                toast.info("You are not an admin. Stay here.");
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleGoogleSignIn = () => {
        alert("Google Sign-In not implemented.");
    };

    const handleFacebookSignIn = () => {
        alert("Facebook Sign-In not implemented.");
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
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {/* Links */}
                        <div className="text-right mt-4">
                            <Link href="/forgot-password" className="text-[#2F8F8A] hover:underline text-sm">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#38A59F] hover:bg-[#2F8F8A]"
                                }`}
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

                        <div className="flex justify-center items-center space-x-4 px-10">
                            <hr className="w-full h-0.5 bg-gray-900" />
                            <h4>Or</h4>
                            <hr className="w-full h-0.5 bg-gray-900" />
                        </div>

                        {/* Social Login Buttons */}
                        <div className="flex space-x-4 justify-center mt-4">
                            {/* Google Login */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#dc2626] hover:bg-[#b91c1c] transition focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                <FaGoogle className="text-white text-2xl" />
                            </button>

                            {/* Facebook Login */}
                            <button
                                type="button"
                                onClick={handleFacebookSignIn}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#165eae] transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <FaFacebook className="text-white text-2xl" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
