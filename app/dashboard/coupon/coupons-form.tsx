"use client";
import React, { useEffect, useState } from "react";
import { getAllCoupon } from "@/app/api/coupon";
import { toast } from "react-toastify";
import { getAllCouponsResponse } from "@/interface/coupon";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CouponList: React.FC = () => {
  const [coupons, setCoupons] = useState<getAllCouponsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCoupon(userId, accessToken, currentPage, pageSize);
        setCoupons(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch coupons.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [userId, accessToken, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    router.push("coupon/create");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Coupon List</h1>
      <div className="mb-6 flex justify-end">
      <button
          onClick={handleCreate}
          className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 focus:outline-none transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Coupon</span>
        </button>
      
       
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : coupons ? (
        <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
          <Table className="min-w-full border-collapse rounded-none">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-lg">Name</TableHead>
                <TableHead className="text-lg">Code</TableHead>
                <TableHead className="text-lg">Start Date</TableHead>
                <TableHead className="text-lg">End Date</TableHead>
                <TableHead className="text-lg">Type</TableHead>
                <TableHead className="text-lg">Value</TableHead>
                <TableHead className="text-lg">Target Type</TableHead>
                <TableHead className="text-lg">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="text-lg">{coupon.name}</TableCell>
                  <TableCell className="text-lg">{coupon.code}</TableCell>
                  <TableCell className="text-lg">{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-lg">{new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-lg">{coupon.type}</TableCell>
                  <TableCell className="text-lg">{coupon.value}</TableCell>
                  <TableCell className="text-lg">{coupon.targetType}</TableCell>
                  <TableCell className="text-lg">{coupon.isActive ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                ) : (
                  <span className="text-gray-400 cursor-not-allowed">Previous</span>
                )}
              </PaginationItem>

              {Array.from({ length: coupons.totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {coupons.totalPages > 5 && currentPage < coupons.totalPages - 2 && <PaginationEllipsis />}

              <PaginationItem>
                {currentPage < coupons.totalPages ? (
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                ) : (
                  <span className="text-gray-400 cursor-not-allowed">Next</span>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <p>No coupons found.</p>
      )}
    </div>
  );
};

export default CouponList;
