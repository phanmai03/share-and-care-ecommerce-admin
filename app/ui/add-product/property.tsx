import { ProductData } from "@/interface/product";
import React, { useState, useEffect } from "react";

interface PropertyProps {
  formData: ProductData;
  onChange: (price: number, originalPrice: number, quantity: number) => void;
}

const PropertyForm: React.FC<PropertyProps> = ({ formData, onChange }) => {
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
    onChange(price, originalPrice, quantity);
  }, [price, originalPrice, quantity, onChange]);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Properties</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giá gốc sản phẩm</label>
          <input
            type="number"
            value={originalPrice}
            onChange={handleOriginalPriceChange}
            placeholder="Nhập giá gốc"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giá đã giảm</label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="Nhập giá giảm"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Kho hàng</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Nhập số lượng kho"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
