"use client";
import React, { useState } from "react";
import Heading from "@/app/ui/heading";
import Detail from "@/app/ui/add-product/detail-product";
import Images from "@/app/ui/add-product/image-upload";
import Property from "@/app/ui/add-product/property";
import { toast } from "react-toastify";
import { createProduct } from "@/app/api/product";
import { ProductData } from "@/interface/product";
import ProductVariants from "@/app/ui/add-product/variant";

const Page = () => {
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    category: [],
    attributes: [],
    mainImage: "",
    subImages: [],
    price: 0,
    originalPrice: 0,
    quantity: 0,
    variants: [],
    skuList: [],
  });

  const [isAddingVariants, setIsAddingVariants] = useState<boolean>(false);
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || !accessToken) {
      toast.error("Missing authentication information. Please log in again.");
      return;
    }

    // Define the required string fields
    const requiredStringFields: (keyof ProductData)[] = [
      "name",
      "description",
      "mainImage", // Assuming mainImage is required
    ];

    // Validation: Check for empty string fields in formData
    for (const field of requiredStringFields) {
      if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
        toast.error(`Please fill in the ${field}.`);
        return;
      }
    }

    // Check numeric fields
    const numericFields: (keyof ProductData)[] = ["price", "originalPrice", "quantity"];
    for (const field of numericFields) {
      const value = formData[field];
      if (typeof value !== "number" || value <= 0) {
        toast.error(`${field} must be a number greater than 0.`);
        return;
      }
    }

    try {
      await createProduct(
        { ...formData },
        userId,
        accessToken
      );

      toast.success("Product added successfully!");
    } catch (error) {
      toast.error(`Error creating product: ${error}`);
    }
  };

  const handleToggleVariants = () => {
    setIsAddingVariants(!isAddingVariants);
  };

  return (
    <div className="min-h-screen p-6">
      <Heading title="Add Product" />
      <div className="flex justify-center items-center mt-6">
        <div className="bg-white max-w-4xl w-full p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Product Details */}
            <Detail formData={formData} setFormData={setFormData} />
            {/* Product Images */}
            <Images
              formData={formData}
              setFormData={setFormData}
              userId={userId}
              accessToken={accessToken}
            />

            <Property formData={formData} setFormData={setFormData} />

            {/* Conditionally Render Properties or Variants */}
            {isAddingVariants && (
              <ProductVariants setFormData={setFormData} />
            )}

            {/* Toggle to show properties or variants */}
            <div className="flex justify-between items-center my-6">
              <button
                type="button"
                onClick={handleToggleVariants}
                className="px-4 py-2 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400"
              >
                {isAddingVariants ? "Cancel Add Variants" : "Add Variants"}
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#38A59F] text-white rounded-lg shadow hover:bg-[#2F8F8A] transition"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;