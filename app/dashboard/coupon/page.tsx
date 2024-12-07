"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createCoupon } from "@/app/api/coupon";
import * as Coupon from "@/interface/coupon";

const CreateCoupon = () => {

  // Form state
  const [formData, setFormData] = useState<Coupon.CouponData>({
    name: "",
    code: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "PERCENT", // Default to "PERCENT"
    value: 0,
    minValue: 0,
    maxValue: 0,
    maxUses: 0,
    maxUsesPerUser: 0,
    targetType: "Order", // Default to "Order"
    // targetIds: [], // Optional target IDs if needed
  });

  const userId = localStorage.getItem("userId") || ""; // Replace with a secure method of fetching user ID
  const accessToken = localStorage.getItem("accessToken") || ""; // Replace with a secure method of fetching access token

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    if (
      ["value", "minValue", "maxValue", "maxUses", "maxUsesPerUser"].includes(name) &&
      Number(value) < 0
    ) {
      toast.error(`${name} cannot be negative.`);
      return; // Ngăn không cập nhật giá trị
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Kiểm tra giá trị âm
    const negativeFields = ["value", "minValue", "maxValue", "maxUses", "maxUsesPerUser"];
    for (const field of negativeFields) {
      if (Number(formData[field as keyof Coupon.CouponData]) < 0) {
        toast.error(`${field} cannot be negative.`);
        return; // Ngăn không gửi biểu mẫu
      }
    }
  
    try {
      const response = await createCoupon(formData, userId, accessToken);
      toast.success("Coupon created successfully!");
    } catch (error) {
      toast.error("Failed to create coupon.");
    }
  };
  

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create Coupon</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block font-medium">Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="PERCENT">PERCENT</option>
            {/* Add other options if necessary */}
            <option value="AMOUNT">AMOUNT</option>
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="block font-medium">Value</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Min Value */}
        <div>
          <label className="block font-medium">Min Value</label>
          <input
            type="number"
            name="minValue"
            value={formData.minValue}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Max Value */}
        <div>
          <label className="block font-medium">Max Value</label>
          <input
            type="number"
            name="maxValue"
            value={formData.maxValue}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Max Uses */}
        <div>
          <label className="block font-medium">Max Uses</label>
          <input
            type="number"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Max Uses Per User */}
        <div>
          <label className="block font-medium">Max Uses Per User</label>
          <input
            type="number"
            name="maxUsesPerUser"
            value={formData.maxUsesPerUser}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Target Type */}
        <div>
          <label className="block font-medium">Target Type</label>
          <select
            name="targetType"
            value={formData.targetType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Order">Order</option>
            {/* Add other options if necessary */}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#38A59F] hover:bg-[#2F8F8A] text-white rounded"
          >
            Create Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
