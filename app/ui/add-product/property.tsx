import { ProductData } from "@/interface/product";
import React, { useState, useEffect } from "react";

interface PropertyProps {
  formData: ProductData;
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>;
}

const PropertyForm: React.FC<PropertyProps> = ({ formData, setFormData }) => {
  const [price, setPrice] = useState<number | null>(formData.price || null);
  const [originalPrice, setOriginalPrice] = useState<number | null>(formData.originalPrice || null);
  const [quantity, setQuantity] = useState<number | null>(formData.quantity || null);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value === "" ? null : parseFloat(e.target.value);
    setPrice(newPrice);
  };

  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOriginalPrice = e.target.value === "" ? null : parseFloat(e.target.value);
    setOriginalPrice(newOriginalPrice);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value === "" ? null : parseInt(e.target.value, 10);
    setQuantity(newQuantity);
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      price: price !== null ? price : 0,
      originalPrice: originalPrice !== null ? originalPrice : 0,
      quantity: quantity !== null ? quantity : 0,
    }));
  }, [price, originalPrice, quantity, setFormData]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Properties</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Original Price</label>
          <input
            type="text"
            value={originalPrice !== null ? originalPrice : ""}
            onChange={handleOriginalPriceChange}
            placeholder="Enter original price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
          <input
            type="text"
            value={price !== null ? price : ""}
            onChange={handlePriceChange}
            placeholder="Enter discounted price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity in Stock</label>
          <input
            type="text"
            value={quantity !== null ? quantity : ""}
            onChange={handleQuantityChange}
            placeholder="Enter quantity in stock"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
