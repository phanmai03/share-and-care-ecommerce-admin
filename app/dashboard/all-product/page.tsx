/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllProduct } from "@/app/api/product";
import { ProductDataResponse, ProductResponse } from "@/interface/product";
import { useRouter } from "next/navigation";
import { GrFormView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import Pagination from "@/app/ui/pagination";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductDataResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const fetchProducts = async (page: number, size: number) => {
    if (!accessToken || !userId) {
      setError("Missing access token or client ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response: ProductResponse = await getAllProduct(userId, accessToken, page, size);

      if (response.products?.length) {
        setProducts(response.products);
        setTotalProducts(response.totalProducts || 0); // Update total products
        setError(null);
      } else {
        setError("No products found");
      }
    } catch (error) {
      setError("Failed to fetch products");
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  const handleView = (id: string) => router.push(`all-product/${id}`);
  const handleEdit = (id: string) => router.push(`all-product/${id}/edit`);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-5">
        {products?.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md flex flex-col h-full">
              <img
                src={product.mainImage || "/default-image.jpg"}
                alt={product.name || "Product"}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg font-bold text-green-600">
                {product.price.toLocaleString()} VND
              </p>
              {product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} VND
                </p>
              )}
              <p className="text-sm text-gray-500">
                {product.quantity} available | {product.sold} sold
              </p>

              {/* Display additional attributes */}
              <p className="text-sm text-gray-600">Rating: {product.rating}</p>
              <p className="text-sm text-gray-600">Views: {product.views}</p>
              {product.uniqueViews.length > 0 ? (
                <p className="text-sm text-gray-600">Unique Views: {product.uniqueViews.length}</p>
              ) : (
                <p className="text-sm text-gray-600">Unique Views: 0</p>
              )}
              <p className="text-sm text-gray-600">Slug: {product.slug}</p>

              {/* Variants display */}
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-700">Variants:</h3>
                {product.variants.map((variant, idx) => (
                  <div key={idx} className="mb-2">
                    <h4 className="font-semibold text-gray-600">{variant.name}:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {variant.options.map((option, optionIdx) => (
                        <li key={optionIdx}>
                          {option} {variant.images[optionIdx] && (
                            <img
                              src={variant.images[optionIdx]}
                              alt={option}
                              className="w-10 h-10 object-cover inline-block ml-2"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Fixed buttons at the bottom */}
              <div className="mt-auto flex space-x-2 justify-end">
                <button
                  onClick={() => handleView(product.id)}
                  className="bg-blue-800 text-white p-2 rounded-md"
                >
                  <GrFormView />
                </button>
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-teal-500 text-white p-2 rounded-md"
                >
                  <FaEdit />
                </button>
              </div>
            </div>

          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalProducts}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ProductList;
