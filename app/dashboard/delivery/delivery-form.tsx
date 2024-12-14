"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllDelivery } from "@/app/api/delivery"; // Ensure correct import
import * as Delivery from "@/interface/delivery";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table"; // Import Table components
import { GrFormView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { Plus } from "lucide-react";

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

        if (Array.isArray(response)) {
          setDeliveries(response); // Update state with data
        } else {
          toast.error("Invalid data structure returned from the API.");
        }
      } catch {
        toast.error("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries(); // Fetch data on component mount
  }, [accessToken, userId]); // Re-run when accessToken or userId changes

  if (loading) {
    return <p className="text-center text-lg text-gray-700">Loading deliveries...</p>;
  }

  const handleCreate = () => {
    router.push("delivery/create");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Delivery List</h1>
      
      <div className="mb-6 flex justify-end">
      <button
          onClick={handleCreate}
          className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 focus:outline-none transition-all duration-300 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Delivery</span>
        </button>
        </div>
        <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
        <Table className="min-w-full border-collapse rounded-none">
          <TableHeader>
            <TableRow className=" bg-gray-100">
              <TableHead className="text-lg">Name</TableHead>
              <TableHead className="text-lg">Description</TableHead>
              <TableHead className="text-lg">Status</TableHead>
              <TableHead className="text-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="text-lg">{delivery.name}</TableCell>
                  <TableCell className="text-lg">{delivery.description}</TableCell>
                  <TableCell className="text-lg">
                    <span
                      className={`${delivery.isActive ? "text-green-500" : "text-red-500"
                        } font-semibold`}
                    >
                      {delivery.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`delivery/${delivery.id}`)}
                        className="bg-blue-800 text-white p-3 rounded-md hover:bg-blue-900 transition-colors"
                      >
                        <GrFormView />
                      </button>
                      <button
                        onClick={() => router.push(`delivery/${delivery.id}/edit`)}
                        className="bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600 transition-colors"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No deliveries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};

export default DeliveriesCardList;
