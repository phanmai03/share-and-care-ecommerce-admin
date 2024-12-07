// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router"; // Dùng next/router để lấy thông tin tham số id
// import { getProductDetail } from "@/app/api/product"; // Đảm bảo rằng đường dẫn đúng với file của bạn
// import { ProductDataDetailResponse } from "@/interface/product"; // Đảm bảo rằng kiểu dữ liệu ProductDataDetailResponse là chính xác
// import { toast } from "react-toastify";

// interface ProductDetailProps {
//   params: { id: string };
// }

// const ProductDetailPage: React.FC<ProductDetailProps> = ({ params }) => {
//   const [product, setProduct] = useState<ProductDataDetailResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const router = useRouter();

//   const accessToken = localStorage.getItem("accessToken");
//   const userId = localStorage.getItem("userId");
//   const { id } = params; // Lấy id từ tham số URL

//   useEffect(() => {
//     const fetchProductDetail = async () => {
//       if (!accessToken || !userId) {
//         setError("Missing access token or client ID");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response: ProductDataDetailResponse = await getProductDetail(id, userId, accessToken);
//         setProduct(response); // Lưu thông tin sản phẩm vào state
//       } catch (error) {
//         setError("Failed to fetch product details");
//         toast.error("Failed to fetch product details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductDetail();
//   }, [id, userId, accessToken]);

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   if (!product) return <p className="text-center">Product not found.</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{product.product.name}</h1>
//       <div className="flex space-x-4">
//         <img
//           src={product.product.mainImage || "/default-image.jpg"}
//           alt={product.product.name}
//           className="w-1/2 h-auto object-cover"
//         />
//         <div className="w-1/2">
//           <p className="text-lg font-bold text-green-600">
//             {product.product.price.toLocaleString()} VND
//           </p>
//           {product.product.originalPrice > product.product.price && (
//             <p className="text-sm text-gray-500 line-through">
//               {product.product.originalPrice.toLocaleString()} VND
//             </p>
//           )}
//           <p className="text-sm text-gray-500">Quantity: {product.product.quantity}</p>
//           <p className="text-sm text-gray-500">Sold: {product.product.sold}</p>
//           <p className="mt-4">{product.product.description}</p>
//           <p className="mt-4">
//             <strong>Category:</strong> {product.product.category.map((cat) => cat.name).join(", ")}
//           </p>

//           {/* Variants */}
//           <div className="mt-4">
//             <h3 className="font-semibold">Variants:</h3>
//             {product.product.variants.map((variant) => (
//               <div key={variant.name}>
//                 <strong>{variant.name}:</strong> {variant.options.join(", ")}
//               </div>
//             ))}
//           </div>

//           {/* Buttons */}
//           <div className="mt-4 flex space-x-2 justify-start">
//             <button
//               onClick={() => router.push(`/product/${product.product.id}/edit`)}
//               className="bg-teal-500 text-white p-2 rounded-md"
//             >
//               Edit Product
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;
"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ProductDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra và cập nhật id khi searchParams thay đổi
    const productId = searchParams.get('id');
    // console.log('Product ID from search params:', productId);
    setId(productId);
  }, [searchParams]); // Sử dụng [searchParams] làm dependency để chạy lại khi searchParams thay đổi

  return (
    <div>
      <h1>Product Detail for {id}</h1>
      {/* Render product details */}
    </div>
  );
};

export default ProductDetail;



