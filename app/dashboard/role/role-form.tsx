"use client";

import React, { useEffect, useState } from "react";
import { getAllRole, deleteRole } from "@/app/api/role";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Role } from "@/interface/role";
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
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const router = useRouter();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchRoles = async () => {
    try {
      const response = await getAllRole(userId, accessToken, page, size);
      setRoles(response.roles);
      setTotalPages(response.totalPages);
    } catch {
      toast.error("Failed to fetch roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, size]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreate = () => router.push("role/create");
  const handleView = (id: string) => router.push(`role/${id}`);
  const handleEdit = (id: string) => router.push(`role/${id}/edit`);

  const handleDelete = (id: string) => {
    setRoleToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete, userId, accessToken);
        toast.success("Role deleted successfully");
        fetchRoles();
      } catch {
        toast.error("Failed to delete role");
      }
      setIsDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setRoleToDelete(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Role List</h1>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 flex items-center space-x-2 transition-shadow shadow-md"
        >
          <Plus size={20} />
          <span>Create Role</span>
        </button>
      </div>

      <div className="container mx-auto mt-6 p-4 bg-white shadow-lg rounded-md">
        <Table className="w-full border-gray-200 rounded-md">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-lg text-center px-4 py-2">Name</TableHead>
              <TableHead className="text-lg text-center px-4 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="hover:bg-gray-50">
                <TableCell className="text-lg text-center px-4 py-2 text-gray-700">
                  {role.name}
                </TableCell>
                <TableCell className="text-lg text-center flex justify-center items-center space-x-4 py-2">
                  <button
                    onClick={() => handleView(role.id)}
                    className="bg-blue-800 text-white p-2 rounded-md hover:bg-blue-600 transition"
                  >
                    <GrFormView size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(role.id)}
                    className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 transition"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-6 flex justify-center">
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

        {isDialogOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this role?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleList;
