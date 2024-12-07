"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createDelivery } from "@/app/api/delivery";
import * as Delivery from "@/interface/delivery";

const CreateDeliveryForm: React.FC = () => {
  const [formData, setFormData] = useState<Delivery.DeliveryData>({
    name: "",
    description: "",
    maxDistance: 0,
    baseFee: 0,
    pricing: [],
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "maxDistance" || name === "baseFee" ? +value : value,
    }));
  };

  // Handle pricing changes
  const handlePricingChange = (
    index: number,
    field: "threshold" | "feePerKm",
    value: string
  ) => {
    const updatedPricing = [...formData.pricing];
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: +value,
    };
    setFormData((prevData) => ({ ...prevData, pricing: updatedPricing }));
  };

  // Add a new pricing tier
  const addPricingTier = () => {
    setFormData((prevData) => ({
      ...prevData,
      pricing: [...prevData.pricing, { threshold: 0, feePerKm: 0 }],
    }));
  };

  // Remove a pricing tier
  const removePricingTier = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      pricing: prevData.pricing.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken || !userId) {
      toast.error("Missing authentication information.");
      return;
    }

    try {
      const response = await createDelivery(formData, userId, accessToken);
      toast.success(`Delivery created successfully: ${response.name}`);
      setFormData({
        name: "",
        description: "",
        maxDistance: 0,
        baseFee: 0,
        pricing: [],
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to create delivery.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-md max-w-md mx-auto"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter delivery name"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter delivery description"
        />
      </div>
      <div>
        <label htmlFor="maxDistance" className="block text-sm font-medium">
          Max Distance (km)
        </label>
        <input
          id="maxDistance"
          name="maxDistance"
          type="number"
          value={formData.maxDistance}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="baseFee" className="block text-sm font-medium">
          Base Fee
        </label>
        <input
          id="baseFee"
          name="baseFee"
          type="number"
          value={formData.baseFee}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Pricing</label>
        {formData.pricing.map((tier, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Threshold"
              value={tier.threshold}
              onChange={(e) =>
                handlePricingChange(index, "threshold", e.target.value)
              }
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Fee per km"
              value={tier.feePerKm}
              onChange={(e) =>
                handlePricingChange(index, "feePerKm", e.target.value)
              }
              className="w-1/2 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removePricingTier(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPricingTier}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Pricing Tier
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none"
      >
        Create Delivery
      </button>
    </form>
  );
};

export default CreateDeliveryForm;
