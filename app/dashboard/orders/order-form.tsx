"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrder } from "@/app/api/order";
import { toast } from "react-toastify";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { GrFormView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";

interface Order {
  id: string;
  shippingAddress: {
    fullname: string;
    phone: string;
  };
  deliveryMethod: { name: string };
  totalPrice: number;
  paymentMethod: string;
  status: string;
  nextStatus: string;
}

const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(5);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const handleView = (id: string) => router.push(`orders/${id}`);
  const handleEdit = (id: string) => router.push(`orders/${id}/edit`);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrder(userId, accessToken, page, size);
      setOrders(response.orders);
      setTotalOrders(response.totalOrders || 0);
    } catch{
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
        <Table className="min-w-full border-collapse rounded-none">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-lg">Customer</TableHead>
              <TableHead className="text-lg">Phone</TableHead>
              <TableHead className="text-lg">Delivery Method</TableHead>
              <TableHead className="text-lg">Total Price</TableHead>
              <TableHead className="text-lg">Payment Method</TableHead>
              <TableHead className="text-lg">Status</TableHead>
              <TableHead className="text-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="text-lg">{order.shippingAddress.fullname}</TableCell>
                <TableCell className="text-lg">{order.shippingAddress.phone}</TableCell>
                <TableCell className="text-lg">{order.deliveryMethod.name}</TableCell>
                <TableCell className="text-lg">{order.totalPrice.toLocaleString()} VND</TableCell>
                <TableCell className="text-lg">{order.paymentMethod}</TableCell>
                <TableCell className="text-lg">{order.status}</TableCell>

                <TableCell className="flex space-x-2">
                  <button onClick={() => handleView(order.id)} className="bg-blue-800 text-white p-3 rounded-md">
                    <GrFormView />
                  </button>

                  <button
                    onClick={() => handleEdit(order.id)}
                    className="bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              {page > 1 ? (
                <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
              ) : (
                <span className="text-gray-400 cursor-not-allowed">Previous</span>
              )}
            </PaginationItem>

            {Array.from({ length: Math.ceil(totalOrders / size) }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink isActive={page === index + 1} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < Math.ceil(totalOrders / size) && <PaginationNext onClick={() => handlePageChange(page + 1)} />}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default OrderList;
