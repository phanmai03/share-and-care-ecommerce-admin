"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getRoleDetail } from "@/app/api/role"; 
import { RoleDetailResponse } from "@/interface/role"; 


const RoleDetail: React.FC = () => {
  const [roleDetail, setRoleDetail] = useState<RoleDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoleDetail = async (roleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRoleDetail(roleId, userId, accessToken);
      setRoleDetail(response);
    } catch {
      setError("Failed to fetch role details.");
      toast.error("Failed to fetch role details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoleDetail(id as string);
    }
  }, [id]);

  if (isLoading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
     <button
        onClick={() => router.back()} // Alternatively: router.push("/dashboard/role")
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mb-4"
      >
        Back
      </button>

      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Role Detail</h1>

      {roleDetail && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mb-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-4 text-left">Role: {roleDetail.name}</h2>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Permissions</h3>
            <div className="space-y-4">
              {Object.entries(roleDetail.permissions).map(([key, entities]) => (
                <div key={key}>
                  <h4 className="text-lg font-semibold text-gray-800">{key}</h4>
                  {Object.entries(entities).map(([entity, actions]) => (
                    <div key={entity}>
                      <h5 className="text-md font-medium text-gray-600">{entity}</h5>
                      <ul className="list-disc pl-6">
                        {Object.entries(actions).map(([action, isAllowed]) => (
                          <li key={action} className="text-sm text-gray-500">
                            <span className={`font-bold ${isAllowed ? 'text-green-600' : 'text-red-600'}`}>
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDetail;
