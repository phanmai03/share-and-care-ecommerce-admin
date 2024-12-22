"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProduct, getAllSearchProduct } from "@/app/api/product";
import VariantSwitch from "@/app/ui/public-variant";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GrFormView } from "react-icons/gr";
import { ProductDataResponse, ProductResponse } from "@/interface/product";


const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

const ProductListWithVariants: React.FC = () => {
  const [products, setProducts] = useState<ProductDataResponse[]>([]);
  const [, setTotalProducts] = useState<number>(0);
  const [, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [query] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const handleView = (id: string) => router.push(`variant/${id}`);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const fetchProducts = async (page: number, size: number, searchQuery?: string) => {
    if (!accessToken || !userId) {
      setError("Missing access token or client ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response: ProductResponse = searchQuery
        ? await getAllSearchProduct(searchQuery, userId, accessToken, page, size)
        : await getAllProduct(userId, accessToken, page, size);

      setProducts(response.products || []);
      setTotalProducts(response.totalProducts || 0);
      setTotalPages(Math.ceil(response.totalProducts / size));
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize, query);
  }, [currentPage, pageSize, query]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Variant List</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
        {/* Search Input */}
        <div className="flex justify-end items-center mb-4">
          
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        {/* Products Table */}
        <Table className="min-w-full border-collapse rounded-none">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-lg">Image</TableHead>
              <TableHead className="text-lg">Name</TableHead>
              <TableHead className="text-lg">Slug</TableHead>
              <TableHead className="text-lg">Price</TableHead>
              <TableHead className="text-lg">Status</TableHead>
              <TableHead className="text-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-100 transition-colors">
                <TableCell>
                  <img src={product.mainImage} alt={product.name} className="w-16 h-16 object-cover" />
                </TableCell>
                <TableCell className="text-lg">{product.name}</TableCell>
                <TableCell className="text-lg">{product.slug}</TableCell>
                <TableCell className="text-lg">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <VariantSwitch
                    id={product.id}
                    status={product.status}
                    onStatusChange={(newStatus) => console.log(newStatus)}
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleView(product.id)}
                    className="bg-blue-800 text-white p-3 rounded-md"
                  >
                    <GrFormView />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination>
          <PaginationPrevious
            onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)}
          />
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationLink
                key={i + 1}
                isActive={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default ProductListWithVariants;
