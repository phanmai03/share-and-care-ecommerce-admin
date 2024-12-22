"use client";
import React, { useState } from "react";
import { createRole } from "@/app/api/role"; // API call to create role
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

// Explicitly type the category and entity objects
const categories: ("MANAGE_PRODUCT" | "SYSTEM" | "MANAGE_ORDER" | "SETTING")[] = [
  "MANAGE_PRODUCT",
  "SYSTEM",
  "MANAGE_ORDER",
  "SETTING",
];
const entities: { [key in "MANAGE_PRODUCT" | "SYSTEM" | "MANAGE_ORDER" | "SETTING"]: string[] } = {
  MANAGE_PRODUCT: ["PRODUCT", "CATEGORY", "SKU", "UPLOAD", "COUPON"],
  SYSTEM: ["USER", "ROLE"],
  MANAGE_ORDER: ["REVIEW", "ORDER"],
  SETTING: ["PAYMENT_TYPE", "DELIVERY_TYPE", "CITY"],
};
const actions: string[] = ["CREATE", "VIEW", "UPDATE", "DELETE"];

const CreateRole: React.FC = () => {
  const [roleData, setRoleData] = useState<RoleData>({
    name: "",
    permissions: {
      MANAGE_PRODUCT: {
        PRODUCT: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
        CATEGORY: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
        SKU: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
        UPLOAD: { CREATE: false, DELETE: false },
        COUPON: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
      },
      SYSTEM: {
        USER: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
        ROLE: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
      },
      MANAGE_ORDER: {
        REVIEW: { UPDATE: false, DELETE: false },
        ORDER: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
      },
      SETTING: {
        PAYMENT_TYPE: { CREATE: false, UPDATE: false, DELETE: false },
        DELIVERY_TYPE: { CREATE: false, VIEW: false, UPDATE: false, DELETE: false },
        CITY: { CREATE: false, UPDATE: false, DELETE: false },
      },
    },
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (
    category: string,
    entity: string,
    action: string,
    value: boolean
  ) => {
    setRoleData((prev) => {
      const updatedPermissions = { ...prev.permissions };
      updatedPermissions[category][entity][action] = value;
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId") || "";
    const accessToken = localStorage.getItem("accessToken") || "";
    try {
      await createRole(roleData, userId, accessToken);
      toast.success("Role created successfully");
      router.push("/dashboard/role"); // Redirect to roles list after creation
    } catch {
      toast.error("Failed to create role");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
      >
        Back
      </button>

      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create Role</h1>

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
                        checked={roleData.permissions[category][entity][action]}
                        onChange={(e) =>
                          handlePermissionChange(category, entity, action, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor={`${category}-${entity}-${action}`}
                        className="text-gray-600"
                      >
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
            Create Role
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;
