"use client";

import React, { useEffect, useState } from "react";
import { getAllOrder } from "@/app/api/order"; // Đảm bảo đường dẫn đúng
import { Order, OrderRespone } from "@/interface/order"; // Đảm bảo import đúng
import { toast } from "react-toastify";
import Pagination from "@/app/ui/pagination"; // Tái sử dụng pagination component
import { FaEdit } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const fetchOrders = async (page: number, size: number) => {
    if (!accessToken || !userId) {
      setError("Missing access token or client ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response: OrderRespone = await getAllOrder(userId, accessToken, page, size);
      setOrders(response.orders || []);
      setTotalOrders(response.totalOrders || 0);
      setError(null);
    } catch (error) {
      setError("Failed to fetch orders");
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số lượng trên mỗi trang
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={order.id} className="bg-white border rounded-lg shadow-md p-4">
              <h2 className="font-semibold text-lg">Order #{(currentPage - 1) * pageSize + index + 1}</h2>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <strong>Customer:</strong> {order.shippingAddress.fullname}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {order.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Delivery Method:</strong> {order.deliveryMethod.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total Price:</strong> {order.totalPrice.toLocaleString()} VND
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Next Status:</strong> {order.nextStatus}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md"><GrFormView/></button>
                <button className="bg-teal-500 text-white px-4 py-2 rounded-md"><FaEdit /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-4">
            No orders found.
          </div>
        )}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalOrders}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default OrderList;
