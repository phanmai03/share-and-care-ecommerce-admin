"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/app/api/auth";

export default function UploadAvatarPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem("avatarUrl");
    if (storedAvatarUrl) {
      setAvatarUrl(storedAvatarUrl);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Các định dạng hình ảnh hợp lệ

      if (file.size > maxSize) {
        toast.error("File size exceeds 2MB.");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF).");
        return;
      }

      setSelectedImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        toast.error("User not logged in.");
        setIsUploading(false);
        return;
      }

      const response = await uploadAvatar({ file: selectedImage }, userId, accessToken);

      if (response.image_url) {
        toast.success("Avatar uploaded successfully!");
        setAvatarUrl(response.image_url);
        localStorage.setItem("avatarUrl", response.image_url);
        router.push("/dashboard");
      } else {
        toast.error("Avatar upload failed.");
      }
    } catch {
      toast.error("An error occurred during the upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    router.back(); // Quay về trang trước
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload Your Avatar
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <label htmlFor="avatar" className="block mb-3 text-lg font-medium text-gray-700">
              Select an Avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {avatarUrl && !selectedImage && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Current Avatar:</p>
              <img
                src={avatarUrl}
                alt="Current Avatar"
                className="w-48 h-48 mx-auto rounded-full shadow-md object-cover border border-gray-200"
              />
            </div>
          )}

          {selectedImage && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Avatar"
                className="w-48 h-48 mx-auto rounded-full shadow-md object-cover border border-gray-200"
              />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
                isUploading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Avatar"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleBack}
            className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
