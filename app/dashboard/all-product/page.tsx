"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteProduct, getAllProduct, getAllSearchProduct } from "@/app/api/product";
import { ProductDataResponse, ProductResponse } from "@/interface/product";
import { useRouter } from "next/navigation";
import { GrFormView } from "react-icons/gr";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Pagination,
  PaginationPrevious,
  PaginationContent,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import SearchBar from "@/app/ui/search";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductDataResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

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
      setCurrentPage(response.currentPage || 1);
      setError(null);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts(currentPage, pageSize, query);
  }, [currentPage, pageSize, query]);

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(totalProducts / pageSize);
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleView = (id: string) => router.push(`all-product/${id}`);
  const handleEdit = (id: string) => router.push(`all-product/${id}/edit`);

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete, userId, accessToken);
        toast.success("Product deleted successfully");
        setProducts((prev) =>
          prev.filter((product) => product.id !== productToDelete)
        );
      } catch {
        toast.error("Failed to delete product");
      }
      setIsDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setProductToDelete(null);
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-md">
        <div className="flex justify-between items-center mb-4">
          <SearchBar
            query={query}
            setQuery={setQuery}
            placeholder="Search products..."
            width={300}
          />
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg">Name</TableHead>
              <TableHead className="text-lg">Price</TableHead>
              <TableHead className="text-lg">Stock</TableHead>
              <TableHead className="text-lg">Rating</TableHead>
              <TableHead className="text-lg">Status</TableHead>
              <TableHead className="text-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.mainImage || "/default-image.jpg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-lg">{product.price.toLocaleString()} VND</TableCell>
                  <TableCell className="text-lg">{product.quantity}</TableCell>
                  <TableCell className="text-lg">{product.rating}</TableCell>
                  <TableCell className="text-lg">{product.status}</TableCell>
                  <TableCell className="text-lg">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(product.id)}
                        className="bg-blue-800 text-white p-2 rounded-md"
                      >
                        <GrFormView />
                      </button>
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="bg-teal-500 text-white p-2 rounded-md"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-700 text-white p-2 rounded-md"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      {isDialogOpen && (
        <ConfirmDeleteDialog onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
};

export default ProductList;

const ConfirmDeleteDialog: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">Confirm Deletion</h2>
      <p>Are you sure you want to delete this product?</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded-md">
          Confirm
        </button>
        <button onClick={onCancel} className="bg-gray-300 text-gray-700 p-2 rounded-md">
          Cancel
        </button>
      </div>
    </div>
  </div>
);
