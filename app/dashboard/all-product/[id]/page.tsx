"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetail } from "@/app/api/product"; // Ensure this function fetches the product by ID
import { toast } from "react-toastify";
import { ProductDataDetailResponse } from "@/interface/product"; // Import necessary types
import BackButton from "@/app/ui/back-button"; // Import the BackButton component

const ProductDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState<ProductDataDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get the userId and accessToken from localStorage (make sure they are present)
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  // Ensure id is a string (use the first item in case of string[])
  const productId = Array.isArray(id) ? id[0] : id;

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Ensure that userId and accessToken are available before calling the API
        if (productId && userId && accessToken) {
          const response = await getProductDetail(productId, userId, accessToken);
          setProduct(response); // Set product data
        } else {
          toast.error("Missing authentication information.");
        }
      } catch (error) {
        // console.error("Error fetching product details:", error);
        toast.error("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, userId, accessToken]); // Depend on productId, userId, and accessToken

  // If loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no product, show error message
  if (!product) {
    return <div>Product not found.</div>;
  }

  // Render the product detail page
  return (
    <div className="min-h-screen p-6">
      <BackButton previousPathname="/dashboard/all-product" /> {/* Add Back Button */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img
              src={product.product.mainImage}
              alt={product.product.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {/* Sub Images */}
            <div className="mt-4">
              {product.product.subImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-1/4 mr-2 mb-2 rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-2/3 pl-6">
            <h1 className="text-2xl font-semibold">{product.product.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-lg font-semibold text-gray-500">{`₫ ${product.product.price.toLocaleString()}`}</span>
              <span className="line-through ml-4 text-gray-400">{`₫ ${product.product.originalPrice.toLocaleString()}`}</span>
            </div>
            <p className="mt-4 text-gray-700">{product.product.description}</p>

            {/* Category */}
            <div className="mt-4">
              <strong>Category:</strong>{" "}
              {product.product.category.map((cat) => cat.name).join(", ")}
            </div>

            {/* Attributes */}
            <div className="mt-4">
              <strong>Attributes:</strong>{" "}
              {product.product.attributes.join(", ")}
            </div>

            {/* Variants */}
            <div className="mt-6">
              <strong>Variants:</strong>
              {product.product.variants.map((variant, index) => (
                <div key={index} className="mt-2">
                  <div className="font-semibold">{variant.name}</div>
                  <div className="flex items-center">
                    {variant.images.length > 0 && (
                      <img
                        src={variant.images[0]}
                        alt={variant.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    )}
                    <span>{variant.options.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stock and Status */}
            <div className="mt-4">
              <div className="flex items-center">
                <span className="font-semibold">Quantity:</span>{" "}
                <span>{product.product.quantity}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="font-semibold">Status:</span>{" "}
                <span>{product.product.status}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
