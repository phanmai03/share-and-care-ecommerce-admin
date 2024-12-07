import React, { useState } from 'react';
import { uploadProductImage } from '@/app/api/upload'; // Import upload function
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ProductData } from '@/interface/product';

interface ImageUploadProps {
  formData: ProductData;
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>;
<<<<<<< Updated upstream
}

const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData }) => {
  const [loadingMainImage, setLoadingMainImage] = useState<boolean>(false);
  const [loadingSubImage, setLoadingSubImage] = useState<boolean>(false);
=======
  onChange: (mainImage: string, subImages: Array<string>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData, onChange }) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
>>>>>>> Stashed changes

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

<<<<<<< Updated upstream
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2MB and will not be uploaded.");
      return;
    }

<<<<<<< Updated upstream
    setLoading(true); // Set loading to true while uploading
    try {
      // Call the upload function and get the image URL
      const uploadedImageUrl = await uploadProductImage({ file }, userId, accessToken);
=======
    if (!formData.mainImage) {
      setLoadingMainImage(true);
    } else {
      setLoadingSubImage(true);
    }
>>>>>>> Stashed changes

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
=======
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

    setFormData((prevData) => ({
      ...prevData,
      mainImage: newMainImage ? URL.createObjectURL(newMainImage) : "",
      subImages: newSubImages.map((file) => URL.createObjectURL(file)),
    }));
  };

  // const handleUpload = () => {
  //   if (!mainImage) {
  //     toast.error("Please select a main image to upload.");
  //     return;
  //   }

  //   try {
  //     const mainImageUrl = URL.createObjectURL(mainImage);
  //     const subImageUrls = subImages.map((file) => URL.createObjectURL(file));

  //     // After "upload", call the onChange to propagate the new image URLs back to the parent component
  //     onChange(mainImageUrl, subImageUrls);

  //     toast.success("Product images processed successfully!");
  //   } catch (error) {
  //     console.error("Error processing images:", error);
  //     toast.error("Failed to process images.");
  //   }
  // };
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        )}
      </div>
=======
        </div>
      )}

      {/* <button
        onClick={handleUpload}
        className="mt-6 px-6 py-2 rounded-lg text-white shadow bg-[#38A59F] hover:bg-[#2F8F8A] transition"
      >
        Process Images
      </button> */}
>>>>>>> Stashed changes
    </div>
  );
};

export default ImageUpload;