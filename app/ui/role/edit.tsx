"use client";

import React, { useState, useEffect } from "react";
import { assignRole } from "@/app/api/user";
import { Role } from "@/interface/role";
import { toast } from "react-toastify";
import { getAllRole } from "@/app/api/role";
import { UserData } from "@/interface/user";

interface EditUserModalProps {
  user: UserData;
  onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
  const [roleId, setRoleId] = useState<string>(user.role.id || "");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoles = async () => {
    setLoading(true);

    try {
      const response = await getAllRole(userId, accessToken, 1, 5); // Sử dụng page = 1, size = 5
      setRoles(response.roles || []);
    } catch{
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async () => {
    try {
      const id = user.id; // ID của người dùng
      const result = await assignRole(roleId, id, userId, accessToken);
  
      if (result) {
        // Cập nhật state với thông tin mới
        setRoleId(result.id);  // Hoặc cập nhật props tương ứng
        toast.success("User role updated successfully!");
      } else {
        throw new Error("No data returned from API");
      }
  
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit User Role</h2>

        {/* User Info */}
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* Role Dropdown */}
        <div className="mb-4">
        <select
  value={roleId}
  onChange={(e) => setRoleId(e.target.value)} // Cập nhật `roleId` khi chọn
  className="w-full border p-2 rounded-md"
  disabled={loading || roles.length === 0}
>
  <option value="" disabled>
    Select a role
  </option>
  {roles.map((role) => (
    <option key={role.id} value={role.id}>
      {role.name}
    </option>
  ))}
</select>

        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md"
            onClick={handleSave}
            disabled={loading || !roleId || roles.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
