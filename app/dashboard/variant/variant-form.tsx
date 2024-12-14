"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProduct } from "@/app/api/product";
import { toast } from "react-toastify";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GrFormView } from "react-icons/gr";

interface ProductDataResponse {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  price: number;
  status: string;
}

const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

const ProductListWithVariants: React.FC = () => {
  const [products, setProducts] = useState<ProductDataResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(5);
  const [query, setQuery] = useState<string>(""); // State for search query
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const handleView = (id: string) => router.push(`variant/${id}`);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Update the search query
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProduct(userId, accessToken, page, size, query);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, query]); // Re-fetch when page or query changes

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Variant List</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded"
          />
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
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              {page > 1 ? (
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(page - 1)}
                />
              ) : (
                <span className="text-gray-400 cursor-not-allowed">Previous</span>
              )}
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && page < totalPages - 2 && <PaginationEllipsis />}

            <PaginationItem>
              {page < totalPages ? (
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                />
              ) : (
                <span className="text-gray-400 cursor-not-allowed">Next</span>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProductListWithVariants;
