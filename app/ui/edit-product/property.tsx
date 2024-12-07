import { ProductDataEdit } from "@/interface/product";
import React, { useState, useEffect } from "react";

interface PropertyProps {
  formData: ProductDataEdit;
  setFormData: React.Dispatch<React.SetStateAction<ProductDataEdit>>;
}

const PropertyForm: React.FC<PropertyProps> = ({ formData, setFormData }) => {
  const [price, setPrice] = useState<number>(formData.price || 0);
  const [originalPrice, setOriginalPrice] = useState<number>(formData.originalPrice || 0);
  const [quantity, setQuantity] = useState<number>(formData.quantity || 0);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(newPrice);
  };

  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOriginalPrice = parseFloat(e.target.value);
    setOriginalPrice(newOriginalPrice);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      price,
      originalPrice,
      quantity,
    }));
  }, [price, originalPrice, quantity, setFormData]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Properties</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            onChange={handleOriginalPriceChange}
            placeholder="Enter original price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="Enter discounted price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity in Stock</label>
          <input
            type="number"
            value={quantity}
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