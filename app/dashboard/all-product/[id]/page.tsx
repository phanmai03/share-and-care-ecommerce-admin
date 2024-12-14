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
      } catch {
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
    return <div className="text-center text-lg">Loading...</div>;
  }

  // If no product, show error message
  if (!product) {
    return <div className="text-center text-lg">Product not found.</div>;
  }

  // Render the product detail page
  return (
    <div className="min-h-screen p-6">
      <BackButton previousPathname="/dashboard/all-product" /> {/* Add Back Button */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/3 mb-6 md:mb-0">
            <img
              src={product.product.mainImage}
              alt={product.product.name}
              className="w-full h-auto rounded-lg shadow-md"
            />
            {/* Sub Images */}
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {product.product.subImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-16 h-16 rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-2/3 pl-6">
            <h1 className="text-3xl font-semibold text-gray-800">{product.product.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-xl font-bold text-gray-700 ">{`₫ ${product.product.price.toLocaleString()}`}</span>
              <span className="line-through ml-4 text-gray-500">{`₫ ${product.product.originalPrice.toLocaleString()}`}</span>
            </div>
            
            {/* Rating và Views */}
            <div className="mt-6">
              <div className="flex items-center">
                <span className="font-semibold text-gray-800">Rating:</span>{" "}
                <span className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${product.product.rating && i < Math.round(product.product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927a1 1 0 0 1 1.902 0l1.47 4.427a1 1 0 0 0 .95.69h4.667a1 1 0 0 1 .627 1.8l-3.778 2.742a1 1 0 0 0-.368 1.116l1.423 4.206a1 1 0 0 1-1.518 1.13L10 14.585l-3.662 2.222a1 1 0 0 1-1.517-1.13l1.423-4.206a1 1 0 0 0-.368-1.116L2.756 9.823a1 1 0 0 1 .627-1.8h4.667a1 1 0 0 0 .95-.69l1.47-4.427z" />
                    </svg>
                  ))}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <span className="font-semibold text-gray-800">Views:</span>{" "}
                <span>{product.product.views}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700">{product.product.description}</p>

            {/* Attributes */}
            <div className="mt-4">
              <strong className="text-gray-800">Attributes:</strong>{" "}
              <span>{product.product.attributes.join(", ")}</span>
            </div>

            {/* Variants */}
            <div className="mt-6">
              <strong className="text-gray-800">Variants:</strong>
              {product.product.variants.map((variant, index) => (
                <div key={index} className="mt-2">
                  <div className="font-semibold text-gray-800">{variant.name}</div>
                  <div className="flex items-center mt-1">
                    {variant.images.length > 0 && (
                      <img
                        src={variant.images[0]}
                        alt={variant.name}
                        className="w-12 h-12 rounded-full mr-2"
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
                <span className="font-semibold text-gray-800">Quantity:</span>{" "}
                <span>{product.product.quantity}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="font-semibold text-gray-800">Status:</span>{" "}
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
