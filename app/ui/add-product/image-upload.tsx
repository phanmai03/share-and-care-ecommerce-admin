import { ProductData } from "@/interface/product";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image"; // Import next/image

interface ImageUploadProps {
  formData: ProductData;
  onChange: (mainImage: string, subImages: Array<string>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ formData, onChange }) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);

  useEffect(() => {
    // Pre-fill the form with current formData images if available
    if (formData.mainImage) {
      setMainImage(formData.mainImage ? new File([formData.mainImage], "main-image") : null);
    }
    if (formData.subImages.length) {
      setSubImages(formData.subImages.map((subImage) => new File([subImage], "sub-image")));
    }
  }, [formData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let newMainImage = mainImage || null;
    const newSubImages: File[] = [...subImages];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 2MB and will not be added.`);
        continue;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`File "${file.name}" is not a valid image.`);
        continue;
      }

      if (!newMainImage) {
        newMainImage = file; // Set main image if not already set
      } else {
        newSubImages.push(file); // Add to sub images if main image is set
      }
    }

    setMainImage(newMainImage);
    setSubImages(newSubImages);

    // Call onChange to update the parent component with the new image data
    onChange(
      newMainImage ? URL.createObjectURL(newMainImage) : "",
      newSubImages.map((file) => URL.createObjectURL(file))
    );
  };

  const handleUpload = () => {
    if (!mainImage) {
      toast.error("Please select a main image to upload.");
      return;
    }

    try {
      const mainImageUrl = URL.createObjectURL(mainImage);
      const subImageUrls = subImages.map((file) => URL.createObjectURL(file));

      // After "upload", call the onChange to propagate the new image URLs back to the parent component
      onChange(mainImageUrl, subImageUrls);

      toast.success("Product images processed successfully!");
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Failed to process images.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Product Upload</h2>

      <label
        htmlFor="file-upload"
        className="w-full h-72 p-4 border border-dashed border-gray-300 rounded-md text-center cursor-pointer bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
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

      {/* Display Main Image */}
      {mainImage && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Main Image:</h3>
          <div className="mt-2 flex items-center">
            <Image
              src={URL.createObjectURL(mainImage)}
              alt="Main"
              width={128}
              height={128}
              className="object-cover border rounded"
            />
          </div>
        </div>
      )}

      {/* Display Sub Images */}
      {subImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Sub Images:</h3>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {subImages.map((file, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Sub ${index}`}
                  width={80}
                  height={80}
                  className="object-cover border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-6 px-6 py-2 rounded-lg text-white shadow bg-[#38A59F] hover:bg-[#2F8F8A] transition"
      >
        Process Images
      </button>
    </div>
  );
};

export default ImageUpload;
