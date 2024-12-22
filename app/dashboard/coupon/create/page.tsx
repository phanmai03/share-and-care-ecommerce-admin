"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createCoupon } from "@/app/api/coupon";
import { useRouter } from "next/navigation";
import * as Coupon from "@/interface/coupon";

const CreateCoupon = () => {
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const [formData, setFormData] = useState<Coupon.CouponData>({
    name: "",
    code: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "PERCENT",
    value: null,
    minValue: null,
    maxValue: null,
    maxUses: null,
    maxUsesPerUser: null,
    targetType: "Order",
    targetIds: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["value", "minValue", "maxValue", "maxUses", "maxUsesPerUser"].includes(name)
        ? value === "" ? null : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedData = {
      ...formData,
      value: formData.value || null,
      minValue: formData.minValue || null,
      maxValue: formData.maxValue || null,
      maxUses: formData.maxUses || null,
      maxUsesPerUser: formData.maxUsesPerUser || null,
    };
    try {
      await createCoupon(sanitizedData, userId, accessToken);
      toast.success("Coupon created successfully!");
      router.back();
    } catch{
      toast.error("Failed to create coupon.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl rounded-lg">
      <div className="flex items-center mb-6">
       <button
        onClick={() => router.back()} // Alternatively: router.push("/dashboard/role")
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mb-4"
      >
        Back
      </button>
        <h1 className="ml-4 text-2xl font-bold text-[#2F8F8A]">Create Coupon</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information Card */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter coupon name"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="Enter coupon code"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Provide a detailed description for the coupon"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
              />
            </div>
          </div>
        </div>

        {/* Time Range Card */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Time Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
              />
            </div>
          </div>
        </div>

        {/* Limits Card */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "value", label: "Value" },
              { name: "minValue", label: "Min Value" },
              { name: "maxValue", label: "Max Value" },
              { name: "maxUses", label: "Max Uses" },
              { name: "maxUsesPerUser", label: "Max Uses per User" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name as keyof Coupon.CouponData] ?? ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Target Card */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Target</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Target Type</label>
              <select
                name="targetType"
                value={formData.targetType}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
              >
                <option value="Order">Order</option>
                <option value="Delivery">Delivery</option>
                <option value="Product">Product</option>
              </select>
            </div>
            {formData.targetType === "Product" && (
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Target IDs</label>
                <input
                  type="text"
                  name="targetIds"
                  value={formData.targetIds?.join(",") || ""}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      targetIds: e.target.value
                        .split(",")
                        .map((id) => id.trim())
                        .filter((id) => id),
                    }))
                  }
                  placeholder="Enter IDs separated by commas"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#2F8F8A]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-3 bg-[#38A59F] hover:bg-[#2F8F8A] text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-[#2F8F8A]"
          >
            Create Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
