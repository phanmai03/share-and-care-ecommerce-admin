"use client";

import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllDelivery } from "@/app/api/delivery"; // Ensure correct import
import * as Delivery from "@/interface/delivery";
import { FaEdit } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";
import { useRouter } from "next/navigation";

const DeliveriesCardList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery.DeliveriesData[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState<boolean>(true);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const router = useRouter();

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!userId || !accessToken) {
        toast.error("User authentication details missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await getAllDelivery(userId, accessToken); // API call
        // console.log("API response for deliveries: ", response); // Debug log

        if (Array.isArray(response)) {
          setDeliveries(response); // Update state with data
        } else {
          toast.error("Invalid data structure returned from the API.");
        }
      } catch{
        toast.error("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries(); // Fetch data on component mount
  }, [accessToken, userId]); // Re-run when accessToken or userId changes

  const handleCreateDelivery = () => {
    router.push("delivery/create");
  };

  const handleView = (id: string) => {
    router.push(`delivery/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`delivery/${id}/edit`);
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-700">Loading deliveries...</p>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Delivery List</h2>
        <button
          onClick={handleCreateDelivery}
          className="bg-teal-500 text-white py-2 px-6 rounded-md hover:bg-teal-600 focus:outline-none transition-all duration-300"
        >
          Create Delivery
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deliveries && deliveries.length > 0 ? (
          deliveries.map((delivery, index) => (
            <div
              key={delivery.id}
              className="bg-white border rounded-lg shadow-md p-4 flex flex-col justify-between h-full hover:shadow-xl transition-all"
            >
              <div className="mb-4">
                <span className="text-sm text-gray-500">Delivery #{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{delivery.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{delivery.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span
                  className={`${
                    delivery.isActive ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {delivery.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(delivery.id)}
                    className="bg-blue-800 text-white p-2 rounded-md hover:bg-blue-900 transition-colors"
                  >
                    <GrFormView />
                  </button>
                  <button
                    onClick={() => handleEdit(delivery.id)}
                    className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600  transition-colors"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No deliveries found.</p>
        )}
      </div>
    </div>
    </Suspense>
  );
};

export default DeliveriesCardList;
