"use client";
import React, { useEffect, useState } from 'react';
import { getAllProduct } from '@/app/api/product'; // Ensure this path is correct
import { ProductDataResponse, ProductResponse } from '@/interface/product'; // Correct import for interfaces
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Import Next.js router for navigation
import { GrFormView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductDataResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  const userId= localStorage.getItem('userId')

  useEffect(() => {
    const fetchProducts = async () => {
      if (!accessToken || !userId) {
        setError('Missing access token or client ID');
        setLoading(false);
        return;
      }

      try {
        const response: ProductResponse = await getAllProduct(userId, accessToken);

        if (response.products?.length) {
          setProducts(response.products);
        } else {
          setError('No products found');
        }
      } catch (error) {
        setError('Failed to fetch products');
        toast.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accessToken, userId]);

  const handleView = (id: string) => {
    router.push(`all-product/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`all-product/${id}/edit`);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Product</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
        {products?.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <img
                src={product.mainImage || '/default-image.jpg'}
                alt={product.name || 'Product'}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg font-bold text-green-600">{product.price.toLocaleString()} VND</p>
              {product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} VND
                </p>
              )}
              <p className="text-sm text-gray-500">
                {product.quantity} available | {product.sold} sold
              </p>

              {/* Display the slug */}
              <p className="text-sm text-gray-500">
                <strong>Slug:</strong> {product.slug || 'No slug available'}
              </p>

              {/* Status display */}
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> {product.status}
              </p>

              {/* Rating display */}
              <p className="text-sm text-gray-500">
                <strong>Rating:</strong> {product.rating} / 5
              </p>

              {/* Views display */}
              <p className="text-sm text-gray-500">
                <strong>Views:</strong> {product.views.toLocaleString()}
              </p>

              {/* Buttons */}
              <div className="mt-4 flex space-x-2 justify-end">
                <button
                  onClick={() => handleView(product.id)}
                  className="bg-blue-800 text-white p-2 rounded-md"
                >
                  <GrFormView />
                </button>
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-teal-500 text-white p-2 rounded-md mr-2"
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
    </div>
  );
};

export default ProductList;
