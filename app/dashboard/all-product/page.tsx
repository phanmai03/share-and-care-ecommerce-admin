
"use client";
import React, { useEffect, useState } from 'react';
import { getAllProduct } from '@/app/api/product'; // Ensure this path is correct
import { ProductDataResponse, ProductResponse } from '@/interface/product'; // Correct import for interfaces
import { toast } from 'react-toastify';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductDataResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const accessToken = sessionStorage.getItem('accessToken');
  const clientId = process.env.NEXT_PUBLIC_ADMIN_ID;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!accessToken || !clientId) {
        setError('Missing access token or client ID');
        setLoading(false);
        return;
      }

      try {
        const response: ProductResponse = await getAllProduct(clientId, accessToken);

        if (response?.products && Array.isArray(response.products)) {
          setProducts(response.products);
        } else {
          setError('No products available');
        }
      } catch (error) {
        setError('Error fetching products');
        toast.error(`Error fetching products: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accessToken, clientId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <img
                src={product.mainImage || '/default-image.jpg'}
                alt={product.name || 'Product'}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600">{product.price.toLocaleString()} VND</p>
              {product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} VND
                </p>
              )}
              <p className="text-sm text-gray-500">
                {product.quantity} available | {product.sold} sold
              </p>

              {/* Category display */}
              <p className="text-sm text-gray-500">
                <strong>Category:</strong> {product.category?.map((c) => c.name).join(', ')}
              </p>

              {/* Status display */}
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> {product.status}
              </p>

              {/* Sub images */}
              {product.subImages?.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {product.subImages.map((subImage, index) => (
                    <img
                      key={index}
                      src={subImage}
                      alt={`Sub image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Rating display */}
              <p className="text-sm text-gray-500">
                <strong>Rating:</strong> {product.rating} / 5
              </p>

              {/* Views display */}
              <p className="text-sm text-gray-500">
                <strong>Views:</strong> {product.views.toLocaleString()}
              </p>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mt-2">
                  {product.variants.map((variant, index) => (
                    <div key={index}>
                      <strong>{variant.name}:</strong>
                      <div className="flex space-x-2 mt-1">
                        {variant.options.map((option, idx) => (
                          <span key={idx} className="text-sm text-gray-600">{option}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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


