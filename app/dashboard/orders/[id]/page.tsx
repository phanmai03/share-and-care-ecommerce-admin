"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrderDetail, updateOrderStatus } from "@/app/api/order"; // Correct API imports
import { OrderMetadata } from "@/interface/order"; // Correct type import
import BackButton from "@/app/ui/back-button"; // Import BackButton component

const OrderDetailPage: React.FC = () => {
  const { id } = useParams(); // Get orderId from the URL
  const [order, setOrder] = useState<OrderMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Get userId and accessToken from localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  // Get previous pathname from the router
  const router = useRouter();

  // Check if orderId is a valid string
  const orderId = Array.isArray(id) ? id[0] : id;

  // Fetch order details from API
  const fetchOrder = async () => {
    setLoading(true);
    try {
      if (orderId && userId && accessToken) {
        const response = await getOrderDetail(orderId, userId, accessToken); // Use fetchOrderDetails here
        setOrder(response); // Set order state with fetched data
      } else {
        toast.error("Missing authentication information.");
      }
    } catch (error) {
      // console.error("Error fetching order details:", error);
      toast.error("Error fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!orderId || !userId || !accessToken) {
      toast.error("Missing authentication information.");
      return;
    }

    setUpdatingStatus(true);
    try {
      // Call API to update order status
      await updateOrderStatus(orderId, userId, accessToken); // Update status
      toast.success("Order status updated successfully!");
      fetchOrder(); // Re-fetch the order after updating status
    } catch (error) {
      toast.error("Error updating order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Call fetchOrder when component renders or when orderId changes
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      toast.error("Invalid order ID.");
      // Optionally, redirect or handle invalid orderId
    }
  }, [orderId, userId, accessToken]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If order not found
  if (!order) {
    return <div>Order not found. Please check the order ID or try again later.</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <BackButton previousPathname="/dashboard/orders" /> {/* Render BackButton */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">

        <h1 className="text-3xl font-semibold mb-6">Order Details</h1>

        <div className="mt-6 space-y-6">
          {/* Order Information */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
            <p>Status: {order.status}</p>
          </div>

          {/* Items List */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Items</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center mb-4 space-x-4">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{item.productName} - {item.variantSlug}</h4>
                  <p>Price: ₫ {item.price.toLocaleString()}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ₫ {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <p>{order.shippingAddress.fullname}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
          </div>

          {/* Payment Method */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <p>{order.paymentMethod}</p>
          </div>

          {/* Delivery Method */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Delivery Method</h3>
            <p>{order.deliveryMethod.name}</p>
          </div>

          {/* Pricing Information */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <p>Items Price: ₫ {order.itemsPrice.toLocaleString()}</p>
            <p>Discount: ₫ {order.discountPrice.toLocaleString()}</p>
            <p>Shipping Price: ₫ {order.shippingPrice.toLocaleString()}</p>
            <p>Total Price: ₫ {order.totalPrice.toLocaleString()}</p>
          </div>

          {/* Update Status Button */}
          <div className="mt-6">
            <button
              onClick={handleUpdateStatus}
              className="px-6 py-2 bg-[#38A59F] text-white rounded-md hover:bg-[#2F8F8A] disabled:opacity-50"
              disabled={updatingStatus}
            >
              {updatingStatus ? "Updating..." : "Update Order Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
