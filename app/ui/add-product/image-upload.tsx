import React, { useState } from 'react';
import { uploadProductImage } from '@/app/api/upload'; // Import upload function
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ProductData } from '@/interface/product';

interface ImageUploadProps {
  formData: ProductData;
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>;
  userId: string | null; // Add userId here
  accessToken: string |null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData }) => {
  const [loadingMainImage, setLoadingMainImage] = useState<boolean>(false);
  const [loadingSubImage, setLoadingSubImage] = useState<boolean>(false);

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2MB and will not be uploaded.");
      return;
    }

    if (!formData.mainImage) {
      setLoadingMainImage(true);
    } else {
      setLoadingSubImage(true);
    }

    if (userId && accessToken) {
      try {
        const uploadedImageUrl = await uploadProductImage({ file }, userId, accessToken);
        setFormData((prev: ProductData) => {
          if (!prev.mainImage) {
            return {
              ...prev,
              mainImage: uploadedImageUrl.toString(),
            } as ProductData;
          } else {
            return {
              ...prev,
              subImages: [...prev.subImages, uploadedImageUrl.toString()],
            } as ProductData;
          }
        });

        toast.success("Image uploaded successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to upload image.");
      } finally {
        setLoadingMainImage(false);
        setLoadingSubImage(false);
      }
    }
  };

  const deleteMainImage = () => {
    setFormData((prev: ProductData) => ({
      ...prev,
      mainImage: '',
    }));
    toast.success("Main image deleted successfully!");
  };

  const deleteImage = (index: number) => {
    setFormData((prev: ProductData) => ({
      ...prev,
      subImages: prev.subImages.filter((_, imgIndex) => imgIndex !== index),
    }));
    toast.success("Image deleted successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Product Image</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {loadingMainImage && <p>Uploading Main Image...</p>}
      <div className='space-y-4 my-2'>
        {formData.mainImage && !loadingMainImage && (
          <div className="image-preview">
            <h4>Main Image Preview:</h4>
            <div className="relative">
              <Image
                src={formData.mainImage}
                alt="Uploaded Product"
                width={300}
                height={300}
                className="image-thumbnail"
              />
              <button
                type="button"
                onClick={deleteMainImage}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                &times; {/* Cross icon for delete */}
              </button>
            </div>
          </div>
        )}

        {loadingSubImage && <p>Uploading Sub Image...</p>}
        {formData.subImages.length > 0 && !loadingSubImage && (
          <div className="sub-image-preview">
            <h4>Sub Images Preview:</h4>
            <div className='grid grid-cols-5 gap-4 mt-2'>
              {formData.subImages.map((subImage, index) => (
                <div key={index} className="relative">
                  <Image
                    src={subImage}
                    alt={`Sub Image ${index + 1}`}
                    width={150}
                    height={150}
                    className="image-thumbnail"
                  />
                  <button
                    type="button"
                    onClick={() => deleteImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  >
                    &times; {/* Cross icon for delete */}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;