"use client"
import React, { useState } from "react";
import Variant from "@/app/ui/add-product/variant"

interface OptionGroup {
  id: number;
  type: "color" | "size";
  options: string[];
}

const ProductForm: React.FC = () => {
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([
    { id: 1, type: "color", options: [] },
  ]);

  const isSingleProduct = optionGroups.length === 1 && optionGroups[0].options.length === 0;

  const handleAddOptionGroup = () => {
    setOptionGroups((prev) => [
      ...prev,
      { id: prev.length + 1, type: "color", options: [] },
    ]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Properties</h2>

      {/* Kiểm tra nếu sản phẩm đơn lẻ */}
      {isSingleProduct ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Giá gốc sản phẩm
            </label>
            <input
              type="text"
              placeholder="Nhập giá gốc"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Giá đã giảm
            </label>
            <input
              type="text"
              placeholder="Nhập giá giảm"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Kho hàng
            </label>
            <input
              type="text"
              placeholder="Nhập số lượng kho"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <button
            type="button"
            onClick={handleAddOptionGroup}
            className="px-4 py-2 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400"
          >
            + Thêm nhóm phân loại
          </button>
        </div>
      ) : (
        <Variant/>
      )}
    </div>
  );
};

export default ProductForm;
