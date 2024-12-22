"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrderDetail } from "@/app/api/order"; // Import API chi tiết đơn hàng
import { OrderMetadata } from "@/interface/order"; // Import kiểu dữ liệu đơn hàng

import Image from "next/image";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState<OrderMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  // Lấy userId và accessToken từ localStorage
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  // Kiểm tra orderId có hợp lệ không
  const orderId = Array.isArray(id) ? id[0] : id;

  // Hàm lấy chi tiết đơn hàng từ API
  const fetchOrder = async () => {
    setLoading(true);
    try {
      if (orderId && userId && accessToken) {
        const response = await getOrderDetail(orderId, userId, accessToken);
        setOrder(response); // Lưu thông tin đơn hàng vào state
      } else {
        toast.error("Missing authentication information.");
      }
    } catch {
      toast.error("Error fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchOrder khi component được render hoặc khi orderId thay đổi
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      toast.error("Invalid order ID.");
    }
  }, [orderId, userId, accessToken]);

  // Hiển thị trạng thái tải dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Hiển thị khi không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Order not found. Please check the order ID or try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
     <button
        onClick={() => router.back()} // Alternatively: router.push("/dashboard/role")
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mb-4"
      >
        Back
      </button>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold mb-6">Order Details</h1>

        <div className="mt-6 space-y-6">
          {/* Thông tin đơn hàng */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
            <p>Status: {order.status}</p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Items</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center mb-4 space-x-4">
                <Image
                  src={item.image}
                  alt={item.productName}
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">
                    {item.productName} - {item.variantSlug}
                  </h4>
                  <p>Price: ₫ {item.price.toLocaleString()}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ₫ {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <p>{order.shippingAddress.fullname}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
              {order.shippingAddress.city}
            </p>
          </div>

          {/* Phương thức thanh toán */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <p>{order.paymentMethod}</p>
          </div>

          {/* Phương thức vận chuyển */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Delivery Method</h3>
            <p>{order.deliveryMethod.name}</p>
          </div>

          {/* Thông tin giá cả */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <p>Items Price: ₫ {order.itemsPrice.toLocaleString()}</p>
            <p>Discount: ₫ {order.discountPrice.toLocaleString()}</p>
            <p>Shipping Price: ₫ {order.shippingPrice.toLocaleString()}</p>
            <p>Total Price: ₫ {order.totalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
