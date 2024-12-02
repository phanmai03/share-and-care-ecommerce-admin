"use client";

import React, { useEffect, useState } from "react";
import { getProductDetail } from "@/app/api/product"; // Ensure this path is correct
import { ProductDataDetailResponse, ProductDataDetail, ProductResponse, SkuList } from "@/interface/product";
import { toast } from "react-toastify";

const ProductDetail: React.FC<{ id: ProductResponse }> = ({ id }) => {
  const [product, setProduct] = useState<ProductDataDetail | null>(null);
  const [skuList, setSkuList] = useState<SkuList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_ADMIN_ID;
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!clientId || !accessToken) {
        setError("Missing client ID or access token");
        setLoading(false);
        return;
      }

      try {
        const response: ProductDataDetailResponse = await getProductDetail(id, clientId, accessToken);
        setProduct(response.product[0]); // Assuming the response has a single product
        setSkuList(response.skuList);
      } catch (error) {
        setError("Failed to fetch product details");
        toast.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id , clientId, accessToken]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center">Product not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div>
          <img
            src={product.mainImage || "/default-image.jpg"}
            alt={product.name}
            className="w-full h-auto object-cover rounded-md"
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {product.subImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Sub image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <p>
            <strong>Slug:</strong> {product.slug}
          </p>
          <p>
            <strong>Price:</strong> {product.price.toLocaleString()} VND
          </p>
          <p>
            <strong>Original Price:</strong>{" "}
            {product.originalPrice.toLocaleString()} VND
          </p>
          <p>
            <strong>Quantity:</strong> {product.quantity}
          </p>
          <p>
            <strong>Sold:</strong> {product.sold}
          </p>
          <p>
            <strong>Rating:</strong> {product.rating} / 5
          </p>
          <p>
            <strong>Status:</strong> {product.status}
          </p>
          <p>
            <strong>Views:</strong> {product.views.toLocaleString()}
          </p>
          <p>
            <strong>Unique Views:</strong> {product.uniqueViews.toLocaleString()}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>

          {/* Category */}
          <div>
            <strong>Categories:</strong>
            <ul>
              {product.category.map((cat) => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          </div>

          {/* Attributes */}
          <div>
            <strong>Attributes:</strong>
            <ul>
              {product.attributes.map((attr, index) => (
                <li key={index}>{attr}</li>
              ))}
            </ul>
          </div>

          {/* Variants */}
          <div>
            <strong>Variants:</strong>
            {product.variants.map((variant, index) => (
              <div key={index} className="mt-2">
                <p>
                  <strong>{variant.name}:</strong>
                </p>
                <div className="flex space-x-2">
                  {variant.options.map((option, idx) => (
                    <span key={idx} className="bg-gray-200 px-2 py-1 rounded-md">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKU List */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">SKU List</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">SKU ID</th>
              <th className="border border-gray-300 p-2">Slug</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Sold</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {skuList.map((sku) => (
              <tr key={sku.id}>
                <td className="border border-gray-300 p-2">{sku.id}</td>
                <td className="border border-gray-300 p-2">{sku.slug}</td>
                <td className="border border-gray-300 p-2">{sku.price.toLocaleString()} VND</td>
                <td className="border border-gray-300 p-2">{sku.quantity}</td>
                <td className="border border-gray-300 p-2">{sku.sold}</td>
                <td className="border border-gray-300 p-2">{sku.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetail;
