import React, { useState } from 'react';
import { uploadProductImage } from '@/app/api/upload'; // Import hàm upload
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ImageUploadProps {
 formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  userId: string;
  accessToken: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ userId, accessToken, formData, setFormData }) => {
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Handle the file change event
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file selected by the user
    if (!file) return;

    // Check file size before upload (optional, example: 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2MB and will not be uploaded.");
      return;
    }

    setLoading(true); // Set loading to true while uploading
    try {
      // Call the upload function and get the image URL
      const uploadedImageUrl = await uploadProductImage({ file }, userId, accessToken);

      // Save the URL in formData.mainImage
      setFormData((prev) => ({
        ...prev,
        mainImage: uploadedImageUrl.metadata, // Store the URL in the mainImage field
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false); // Set loading to false when upload is done
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Upload Product Image</h3>
      
      {/* File input */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      
      {/* Show loading indicator if uploading */}
      {loading && <p>Uploading...</p>}

      {/* Display image preview after successful upload */}
      {formData.mainImage && !loading && (
        <div className="image-preview">
          <h4>Image Preview:</h4>
          <Image
            src={formData.mainImage} // Use the URL from formData
            alt="Uploaded Product"
            width={300} // Customize size as needed
            height={300}
            className="image-thumbnail"
          />
        </div>
      )}
    </div>
  );
};


export default ImageUpload;
