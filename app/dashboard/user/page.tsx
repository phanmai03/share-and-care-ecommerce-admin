"use client";

import React, { useEffect, useState } from "react";
import { getAllUser } from "@/app/api/user"; // API path
import { UserData } from "@/interface/user"; // UserData interface
import { toast } from "react-toastify";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("userId");
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
        setUsers(response.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-lg">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left">#</th> {/* Changed from ID to # */}
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition duration-200`}
              >
                <td className="px-6 py-4">{index + 1}</td> {/* Display sequential number */}
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.status}</td>
                <td className="px-6 py-4">{user.role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
