"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllDelivery } from "@/app/api/delivery";
import * as Delivery from "@/interface/delivery";
import { FaEdit } from "react-icons/fa";

const DeliveriesCardList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery.DeliveriesData[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!userId || !accessToken) {
        toast.error("User authentication details missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await getAllDelivery(userId, accessToken);
        // Check if 'response' is an array and contains the right data
        if (Array.isArray(response)) {
          setDeliveries(response); // Update state if the response is an array
        } else {
          toast.error("Invalid data structure returned from the API.");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [accessToken, userId]);

  const handleCreateDelivery = () => {
    window.location.href = "delivery/create"; // Navigate to the create page
  };

  if (loading) {
    return <p className="text-center text-lg">Loading deliveries...</p>;
  }

  return (
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
              className="bg-white border rounded-lg shadow-md p-4 flex flex-col justify-between h-full"
            >
              <div className="mb-4">
                <span className="text-sm text-gray-500">Deliver# {index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{delivery.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{delivery.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`${
                    delivery.isActive ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {delivery.isActive ? "Active" : "Inactive"}
                </span>
                {/* Button fixed at the bottom of the card */}
                <button
                  onClick={() => window.location.href = `delivery/edit/${delivery.id}`}
                  className="bg-teal-500 text-white p-2 rounded-md self-end mt-auto"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No deliveries found.</p>
        )}
      </div>
    </div>
  );
};

export default DeliveriesCardList;
