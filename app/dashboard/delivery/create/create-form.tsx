"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createDelivery } from "@/app/api/delivery";
import * as Delivery from "@/interface/delivery";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "maxDistance" || name === "baseFee"
        ? value === ""
          ? ""
          : Math.max(0, +value)
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handlePricingChange = (
    index: number,
    field: "threshold" | "feePerKm",
    value: string
  ) => {
    const updatedPricing = [...formData.pricing];
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: Math.max(0, +value),
    };
    setFormData((prevData) => ({ ...prevData, pricing: updatedPricing }));
  };

  const addPricingTier = () => {
    setFormData((prevData) => ({
      ...prevData,
      pricing: [...prevData.pricing, { threshold: 0, feePerKm: 0 }],
    }));
  };

  const removePricingTier = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      pricing: prevData.pricing.filter((_, i) => i !== index),
    }));
  };

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
    } catch {
      toast.error("Failed to create delivery.");
    }
  };

  return (
    <div className="min-h-screen p-6">
    <button
    onClick={() => router.back()} // Alternatively: router.push("/dashboard/role")
    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mb-4"
  >
    Back
  </button>

    <div className="min-h-screen mt-16 flex items-start justify-center bg-gray-100">
     
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-white shadow-md rounded-lg max-w-lg w-full"
      >
        <h1 className="text-lg font-bold text-center">Create Delivery</h1>
        <p className="text-sm text-gray-600 text-center">
          Fill in the details below to add a new delivery method.
        </p>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxDistance" className="block text-sm font-medium">
              Max Distance (km)
            </label>
            <input
              id="maxDistance"
              name="maxDistance"
              type="number"
              value={formData.maxDistance === 0 ? "" : formData.maxDistance}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
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
              value={formData.baseFee === 0 ? "" : formData.baseFee}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Pricing</label>
          {formData.pricing.map((tier, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 mt-2 border-b pb-2"
            >
              <input
                type="number"
                placeholder="Threshold"
                value={tier.threshold === 0 ? "" : tier.threshold}
                onChange={(e) =>
                  handlePricingChange(index, "threshold", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
                min="0"
              />
              <input
                type="number"
                placeholder="Fee per km"
                value={tier.feePerKm === 0 ? "" : tier.feePerKm}
                onChange={(e) =>
                  handlePricingChange(index, "feePerKm", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
                min="0"
              />
              <button
                type="button"
                onClick={() => removePricingTier(index)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPricingTier}
            className="mt-3 bg-teal-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Pricing Tier
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          Create Delivery
        </button>
      </form>
      </div>
    </div>
  );
};

export default CreateDeliveryForm;
