"use client";
import React, { useState } from "react";
import Heading from "@/app/ui/heading";
import Detail from "@/app/ui/add-product/detail-product";
import Images from "@/app/ui/add-product/image-upload";
import Property from "@/app/ui/add-product/property";
import { toast } from "react-toastify";
import { createProduct } from "@/app/api/product";
import { ProductData, ProductDetailResponse } from "@/interface/product";
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

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || !accessToken) {
      toast.error("Missing authentication information. Please log in again.");
      return;
    }
    console.log(formData)

    try {

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response: ProductDetailResponse = await createProduct(
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

  console.log(formData)

  return (
    <div className="min-h-screen p-6">
      <Heading title="Add Product" />
      <div className="flex justify-center items-center mt-6">
        <div className="bg-white max-w-4xl w-full p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Details */}
            <Detail formData={formData} setFormData={setFormData} />
            {/* Product Images */}
            <Images
              formData={formData}
              setFormData={setFormData}
              userId={userId}
              accessToken={accessToken}
            />


            {/* Conditionally Render Properties or Variants */}
            {isAddingVariants ? (
              <ProductVariants formData={formData} setFormData={setFormData} />
            ) : (
              <Property formData={formData} setFormData={setFormData} />
            )}

            {/* Toggle to show properties or variants */}
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={handleToggleVariants}
                className="px-4 py-2 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400"
              >
                {isAddingVariants ? "Cancel Adding Variants" : "Add Variants"}
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