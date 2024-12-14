"use client";

import React, { useEffect, useState } from "react";
import { getAllUser } from "@/app/api/user"; // API path
import { UserData } from "@/interface/user"; // UserData interface
import { toast } from "react-toastify";
import BlockUser from "@/app/ui/block-user"; // Import the BlockUser component
import EditUserModal from "@/app/ui/role/edit"; // Your modal component

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Updated table components
import { FaEdit } from "react-icons/fa";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null); // State for the selected user to edit

  const handleEdit = (user: UserData) => setSelectedUser(user);

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

    setAccessToken(token);
    setUserId(id);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken || !userId) {
        toast.error("Missing credentials. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await getAllUser(userId, accessToken);
        if (response && response.users) {
          setUsers(response.users);
        } else {
          toast.error("No users data found in the response.");
        }
      } catch {
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && userId) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [accessToken, userId]);

  const updateUserStatus = (id: string, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">User List</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
        <Table className="min-w-full border-collapse rounded-none">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-lg">Name</TableHead>
              <TableHead className="text-lg text-left">Email</TableHead>
              <TableHead className="text-lg text-left">Status</TableHead>
              <TableHead className="text-lg text-left">Role</TableHead>
              <TableHead className="text-lg text-left">Actions</TableHead>
              <TableHead className="text-lg text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition duration-200`}
                >
                  <TableCell className="text-lg">{user.name}</TableCell>
                  <TableCell className="text-lg">{user.email}</TableCell>
                  <TableCell className="text-lg">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                        user.status === "active" ? "bg-green-200 text-green-600" : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-lg">{user.role.name}</TableCell>
                  <TableCell className="text-lg">
                    <BlockUser
                      id={user.id}
                      status={user.status}
                      onStatusChange={(newStatus: string) => updateUserStatus(user.id, newStatus)}
                    />
                  </TableCell>
                  <TableCell className="text-lg">
                    <button
                      className="bg-teal-600 text-white p-2 rounded-md"
                      onClick={() => handleEdit(user)}
                    >
                      <FaEdit />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Show modal if selected user exists */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserList;
