"use client"
import React, { useState } from 'react';

const ImageUpload = () => {
  const [mainImage, setMainImage] = useState<File | null>(null); // Hình chính
  const [subImages, setSubImages] = useState<File[]>([]); // Hình phụ

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let newMainImage: File | null = mainImage || null; // Nếu chưa có hình chính, đặt tệp đầu tiên làm hình chính
    const newSubImages: File[] = [...subImages];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 2 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 2MB and will not be uploaded.`);
        continue;
      }

      if (!newMainImage) {
        newMainImage = file; // Set hình chính
      } else if (newSubImages.length < 5) {
        newSubImages.push(file); // Set hình phụ
      } else {
        alert('You can only upload up to 5 additional images.');
        break;
      }
    }

    setMainImage(newMainImage);
    setSubImages(newSubImages);
  };

  const handleRemoveMainImage = () => setMainImage(null); // Xóa hình chính
  const handleRemoveSubImage = (index: number) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index)); // Xóa hình phụ
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Images</h2>
      <label
        htmlFor="file-upload"
        className=" w-full h-72 p-4 border border-dashed border-gray-300 rounded-md text-center cursor-pointer bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
      >
        <span className="text-gray-500">
          Drop files here or click to browse through your machine.
        </span>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* Main Image */}
      {mainImage && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Main Image:</h3>
          <div className="mt-2 flex items-center">
            <img
              src={URL.createObjectURL(mainImage)}
              alt="Main"
              className="w-32 h-32 object-cover border rounded"
            />
            <button
              onClick={handleRemoveMainImage}
              className="ml-4 px-2 py-1 text-sm text-white bg-[#dc2626] rounded hover:bg-[#b91c1c]"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Sub Images */}
      {subImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Sub Images:</h3>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {subImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Sub ${index}`}
                  className="w-20 h-20 object-cover border rounded"
                />
                <button
                  onClick={() => handleRemoveSubImage(index)}
                  className="absolute top-0 right-0 bg-[#dc2626] text-white text-xs rounded-full px-1.5 py-0.5 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
