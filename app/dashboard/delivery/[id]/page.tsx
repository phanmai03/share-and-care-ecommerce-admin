"use client"
import { useEffect, useState } from 'react';
import { getDeliveryDetail } from '@/app/api/delivery';
import { useParams } from "next/navigation";
import { DeliveryDataResponse, Pricing } from '@/interface/delivery';

const DeliveryDetail = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const { id } = useParams(); 

  const deliveryId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (deliveryId && userId && accessToken) {
      const fetchDeliveryDetail = async () => {
        try {
          const data = await getDeliveryDetail(deliveryId, userId, accessToken);
          setDeliveryData(data);
        } catch (err) {
          // console.error("Failed to fetch delivery data:", err);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Ensure pricing is always an array to avoid undefined issues
  const pricing = deliveryData?.pricing ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Delivery Detail</h1>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Field</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr className="border-t">
            <td className="px-6 py-3 text-sm text-gray-600">Delivery ID</td>
            <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.id}</td>
          </tr> */}
          <tr>
            <td className="px-6 py-3 text-sm text-gray-600">Name</td>
            <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.name}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm text-gray-600">Status</td>
            <td className="px-6 py-3 text-sm text-gray-800">{deliveryData?.isActive ? 'Active' : 'Inactive'}</td>
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
