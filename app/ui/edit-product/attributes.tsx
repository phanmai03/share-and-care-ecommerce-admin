import React, { useState } from 'react';

export default function Attributes() {
  const [formData, setFormData] = useState({
    originalPrice: '',
    discountedPrice: '',
    stock: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Form data:', formData);
    // Add logic to handle form submission
  };

  return (
    <div className="p-6 bg-white rounded-md">
      <form onSubmit={handleSubmit}>
        {/* Details Section */}
        <h2 className="text-lg font-semibold mb-4">Attribute</h2>
        <div className="mb-4">
          <label
            htmlFor="originalPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Chất liệu
          </label>
          <input
            type="text"
            id="originalPrice"
            name="originalPrice"
            onChange={handleInputChange}
            placeholder="Vui lòng nhập"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="discountedPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Kiểu dáng
          </label>
          <input
            type="text"
            id="discountedPrice"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleInputChange}
            placeholder="Vui lòng nhập"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="season"
            className="block text-sm font-medium text-gray-700"
          >
            Mùa
          </label>
          <input
            type="text"
            id="season"
            name="season"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Vui lòng nhập"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
}
