"use client";
import React, { useState, useEffect } from "react";
import { getRoleDetail, updateRole } from "@/app/api/role"; // API call to update role
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";

// Define the RoleData interface
interface RoleData {
  name: string;
  permissions: {
    [key: string]: {
      [entity: string]: {
        [action: string]: boolean;
      };
    };
  };
}

const categories: ("MANAGE_PRODUCT" | "SYSTEM" | "MANAGE_ORDER" | "SETTING")[] = ["MANAGE_PRODUCT", "SYSTEM", "MANAGE_ORDER", "SETTING"];
const entities: { [key in "MANAGE_PRODUCT" | "SYSTEM" | "MANAGE_ORDER" | "SETTING"]: string[] } = {
  MANAGE_PRODUCT: ["PRODUCT", "CATEGORY", "SKU", "UPLOAD", "COUPON"],
  SYSTEM: ["USER", "ROLE"],
  MANAGE_ORDER: ["REVIEW", "ORDER"],
  SETTING: ["PAYMENT_TYPE", "DELIVERY_TYPE", "CITY"],
};
const actions: string[] = ["CREATE", "VIEW", "UPDATE", "DELETE"];

const EditRole: React.FC = () => {
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Fetch the role data based on the ID passed in the URL
    const fetchRoleData = async () => {
      if (id) {
        try {
          const userId = localStorage.getItem("userId") || "";
          const accessToken = localStorage.getItem("accessToken") || "";
          const roleResponse = await getRoleDetail(id as string, userId, accessToken); // Ensure id is a string
          setRoleData(roleResponse); // Use directly without `metadata`
        } catch (error) {
          console.error('Failed to fetch role data', error);
          toast.error("Failed to fetch role data");
        }
      }
    };

    fetchRoleData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handlePermissionChange = (category: string, entity: string, action: string, value: boolean) => {
    setRoleData((prev) => {
      if (!prev) return null;
  
      // Kiểm tra trước nếu permissions cho category và entity có tồn tại
      const updatedPermissions = { ...prev.permissions };
      if (!updatedPermissions[category]) updatedPermissions[category] = {};
      if (!updatedPermissions[category][entity]) updatedPermissions[category][entity] = {};
  
      updatedPermissions[category][entity][action] = value;
      return { ...prev, permissions: updatedPermissions };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId") || "";
    const accessToken = localStorage.getItem("accessToken") || "";

    if (roleData) {
      try {
        await updateRole(id as string, roleData, userId, accessToken);
        toast.success("Role updated successfully");
        router.push("/dashboard/role"); // Redirect to roles list after update
      } catch{
        toast.error("Failed to update role");
      }
    }
  };

  if (!roleData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Edit Role</h1>

      <form onSubmit={handleSubmit}>
        {/* Role Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-lg font-medium">
            Role Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={roleData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Permissions Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Permissions</h2>

          {categories.map((category) => (
            <div key={category} className="mb-4">
              <h3 className="font-semibold text-gray-800">{category}</h3>
              {entities[category].map((entity) => (
                <div key={entity} className="mb-4">
                  <h4 className="font-medium text-gray-700">{entity}</h4>
                  {actions.map((action) => (
                    <div key={action} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${category}-${entity}-${action}`}
                        checked={roleData.permissions[category]?.[entity]?.[action] || false}
                        onChange={(e) =>
                          handlePermissionChange(category, entity, action, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`${category}-${entity}-${action}`} className="text-gray-600">
                        {action}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none"
          >
            Update Role
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRole;
