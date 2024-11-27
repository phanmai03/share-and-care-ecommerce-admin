"use client";

import React, { useState } from "react";

const CreateProductForm: React.FC = () => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    category: "",
  });

  const categories = ["Clothing", "Electronics", "Books", "Accessories"]; // Danh sách danh mục

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product Details:", productDetails);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Details Section */}
        <h2 className="text-lg font-semibold mb-4">Add product</h2>
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={productDetails.name}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950"
              required
            />
          </div>

          {/* Sub Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sub Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Sub description"
              value={productDetails.description}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={productDetails.category}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950 h-[42px]"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProductForm;
