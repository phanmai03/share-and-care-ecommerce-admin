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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch{
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-8 text-gray-900">User List</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg ring-1 ring-gray-200">
        <table className="min-w-full table-auto text-sm md:text-base text-gray-800">
          <thead className="bg-teal-600 text-white uppercase">
            <tr>
              <th className="px-6 py-3 text-left font-medium">#</th>
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition duration-200`}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                        user.status === "active" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.role.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
