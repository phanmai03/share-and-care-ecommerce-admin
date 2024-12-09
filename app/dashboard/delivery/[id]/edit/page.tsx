"use client";

import { useEffect, useState } from 'react';
import { getDeliveryDetail, updateActive, updateDeactivate, updateDelivery } from '@/app/api/delivery';
import { useParams, useRouter } from "next/navigation"; // Ensure useRouter is imported
import { DeliveryDataResponse, Pricing } from '@/interface/delivery';

const DeliveryDetail = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxDistance: '',
    baseFee: '',
  });

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") ?? "" : "";

  const { id } = useParams();
  const deliveryId = typeof id === "string" ? id : "";

  const router = useRouter(); // Declare the router here

  useEffect(() => {
    if (deliveryId && userId && accessToken) {
      const fetchDeliveryDetail = async () => {
        try {
          const data = await getDeliveryDetail(deliveryId, userId, accessToken);
          setDeliveryData(data);
        } catch {
          setError("Failed to load delivery data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchDeliveryDetail();
    } else {
      setError("Missing required parameters (id, userId, accessToken).");
      setLoading(false);
    }
  }, [deliveryId, userId, accessToken]);

  const handleStatusToggle = async () => {
    if (!deliveryData) return;

    setIsUpdating(true);

    try {
      const action = deliveryData.isActive ? 'deactivate' : 'activate';
      await (action === 'activate' ? updateActive(deliveryId, userId, accessToken) : updateDeactivate(deliveryId, userId, accessToken));

      setDeliveryData(prevData => prevData ? { ...prevData, isActive: !prevData.isActive } : prevData);
    } catch {
      setError("Failed to update delivery status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updatedData = await updateDelivery(deliveryId, userId, accessToken, {
        name: formData.name,
        description: formData.description,
        maxDistance: parseFloat(formData.maxDistance),
        baseFee: parseFloat(formData.baseFee),
      });

      setDeliveryData(updatedData);
      setIsEditing(false);
    } catch {
      setError("Failed to update delivery information. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const pricing = deliveryData?.pricing ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <button
          onClick={() => router.back()} // Ensure router.back() works
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none transition-all"
        >
          Back
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Delivery Detail</h1>

      {isEditing ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Max Distance</label>
          <input
            type="number"
            name="maxDistance"
            value={formData.maxDistance}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Base Fee</label>
          <input
            type="number"
            name="baseFee"
            value={formData.baseFee}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          <div className="mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <table className="min-w-full table-auto border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Field</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-600">Name</td>
                <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.name}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-600">Status</td>
                <td className="px-6 py-3 text-sm text-gray-800">
                  {deliveryData?.isActive ? 'Active' : 'Inactive'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-600">Description</td>
                <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.description}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-600">Max Distance</td>
                <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.maxDistance} km</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm text-gray-600">Base Fee</td>
                <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.baseFee} USD</td>
              </tr>
            </tbody>
          </table>

          <div className="mb-6">
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-lg ${isUpdating ? 'bg-gray-300' : deliveryData?.isActive ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white`}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : deliveryData?.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setFormData({
                  name: deliveryData?.name || '',
                  description: deliveryData?.description || '',
                  maxDistance: deliveryData?.maxDistance?.toString() || '',
                  baseFee: deliveryData?.baseFee?.toString() || '',
                });
              }}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Edit
            </button>
          </div>
        </>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-700">Pricing</h2>
        {pricing.length > 0 ? (
          <table className="min-w-full mt-4 table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Threshold</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fee per Km</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((item: Pricing, index: number) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-3 text-sm text-gray-800">{item.threshold}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{item.feePerKm} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No pricing available</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetail;
