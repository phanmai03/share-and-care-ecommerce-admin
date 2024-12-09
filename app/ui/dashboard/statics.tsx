"use client";

import React, { useState, useEffect } from "react";
import { getSale } from "@/app/api/static"; // Import the API function
import { toast } from "react-toastify"; // Notification library
import { Sale } from "@/interface/statics"; // Replace with the correct path to Sale interface

const SalesStatistics: React.FC = () => {
  const [salesData, setSalesData] = useState<Sale | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve userId and accessToken from localStorage
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

    setAccessToken(token);
    setUserId(id);
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!accessToken || !userId) {
        toast.error("Missing credentials. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const sales = await getSale(userId, accessToken);
        setSalesData(sales);
      } catch {
        toast.error("Failed to fetch sales data.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && userId) {
      fetchSalesData();
    } else {
      setLoading(false);
    }
  }, [accessToken, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-4xl font-semibold mb-8 text-gray-900">Sales Statistics</h1> */}
      {salesData ? (
        <div className="bg-white shadow-lg rounded-lg p-6 ring-1 ring-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-teal-100 border border-teal-400 rounded-lg">
              <h2 className="text-xl font-semibold text-teal-800">Total Order</h2>
              <p className="text-2xl font-bold">{salesData.orderCount}</p>
            </div>
            <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-800">Total Product</h2>
              <p className="text-2xl font-bold">{salesData.productCount}</p>
            </div>
            <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800">Total User</h2>
              <p className="text-2xl font-bold">{salesData.userCount}</p>
            </div>
            <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800">Total Sold</h2>
              <p className="text-2xl font-bold">{salesData.soldProduct}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No sales data available.</p>
      )}
    </div>
  );
};

export default SalesStatistics;
