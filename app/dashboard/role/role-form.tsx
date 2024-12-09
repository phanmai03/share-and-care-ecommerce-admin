"use client";
import React, { useEffect, useState } from "react";
import { getAllRole, deleteRole } from "@/app/api/role"; // Import deleteRole
import { toast } from "react-toastify";
import { Role } from "@/interface/user";
import { FaEdit } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllRole(userId, accessToken, page, size);
      setRoles(response.roles);
      setTotalPages(response.totalPages);
    } catch {
      toast.error("Failed to fetch roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, size]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number(event.target.value));
    setPage(1); // Reset to first page
  };

  const handleCreate = () => {
    router.push("role/create");
  };

  const handleView = (id: string) => router.push(`role/${id}`);
  const handleEdit = (id: string) => router.push(`role/${id}/edit`);

  const handleDelete = async (id: string) => {
    setRoleToDelete(id); // Set role to delete
    setIsDialogOpen(true); // Open the dialog
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete, userId, accessToken);
        toast.success("Role deleted successfully");
        fetchRoles(); // Refresh the roles list
      } catch{
        toast.error("Failed to delete role");
      }
      setIsDialogOpen(false); // Close dialog after delete
      setRoleToDelete(null); // Reset the role to delete
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false); // Close dialog without deleting
    setRoleToDelete(null); // Reset the role to delete
  };

  if (isLoading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-left text-gray-800">Role List</h1>

      {/* Create Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 focus:outline-none transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Role</span>
        </button>
      </div>

      {/* Grid layout for roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">{role.name}</h2>
            </div>
            <div className="flex justify-center space-x-4">
              {/* View button */}
              <button
                onClick={() => handleView(role.id)}
                className="bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition-colors"
              >
                <GrFormView size={22} />
              </button>
              {/* Edit button */}
              <button
                onClick={() => handleEdit(role.id)}
                className="bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FaEdit size={22} />
              </button>
              {/* Delete button */}
              <button
                onClick={() => handleDelete(role.id)}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination and Row Selection */}
      <div className="mb-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-2 sm:mb-0">
          <label htmlFor="size" className="mr-3 text-gray-600">
            Rows per page:
          </label>
          <select
            id="size"
            value={size}
            onChange={handleSizeChange}
            className="border rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex bottom-0 justify-end items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600">{page} / {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Total roles */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">Total Roles: {roles.length}</p>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this role?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleList;
