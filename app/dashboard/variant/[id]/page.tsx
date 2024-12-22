"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getAllVariant, publicVariant, unPublicVariant } from "@/app/api/variant"; // Import API call functions
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import VariantDetailSwitch from "@/app/ui/public-detail"; // Import VariantSwitch component

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Import your custom table components

interface SkuListData {
  id: string;
  slug: string;
  tierIndex: number[];
  isDefault: boolean;
  price: number;
  quantity: number;
  sold: number;
  status: string;
}

interface VariantData {
  skuList: SkuListData[];
}

const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

const VariantDetailPage: React.FC = () => {
  const { id } = useParams(); // Extract id from URL parameters
  const router = useRouter(); // Use the router hook for navigation

  const [variantData, setVariantData] = React.useState<VariantData | null>(null);

  const fetchVariantDetail = async () => {
    try {
      const data = await getAllVariant(id as string, userId, accessToken); // Ensures id is a string
      setVariantData(data);
    } catch {
      toast.error("Failed to load variant data. Please try again.");
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchVariantDetail();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string, skuId: string) => {
    if (userId && accessToken) {
      try {
        if (newStatus === "published") {
          await publicVariant(skuId, userId, accessToken);
        } else {
          await unPublicVariant(skuId, userId, accessToken);
        }
        
        // Update the local state
        setVariantData((prevData) => {
          if (prevData) {
            return {
              ...prevData,
              skuList: prevData.skuList.map((sku) =>
                sku.id === skuId ? { ...sku, status: newStatus } : sku
              ),
            };
          }
          return prevData;
        });

        toast.success(`Variant status updated to ${newStatus}!`);
      } catch{
        toast.error("Failed to update variant status.");
      }
    }
  };

  if (!variantData) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <div>
        <h1 className="text-3xl font-bold">Detail Variant</h1>
        <button
        onClick={() => router.back()} // Alternatively: router.push("/dashboard/role")
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 mb-4"
      >
        Back
      </button>
        <div className="container mx-auto mt-6 p-4 bg-white rounded-none shadow-lg">
      <Table className="min-w-full border-collapse rounded-none">
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Slug</TableHead>
            <TableHead className="text-lg">Tier Index</TableHead>
            <TableHead className="text-lg">Price</TableHead>
            <TableHead className="text-lg" >Quantity</TableHead>
            <TableHead className="text-lg">Sold</TableHead>
            <TableHead className="text-lg">Status</TableHead>
            <TableHead className="text-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variantData.skuList.map((sku) => (
            <TableRow key={sku.id}>
              <TableCell className="text-lg">{sku.slug}</TableCell>
              <TableCell className="text-lg">{sku.tierIndex.join(", ")}</TableCell>
              <TableCell className="text-lg">${sku.price.toFixed(2)}</TableCell>
              <TableCell className="text-lg">{sku.quantity}</TableCell>
              <TableCell className="text-lg">{sku.sold}</TableCell>
              <TableCell className="text-lg">{sku.status}</TableCell>
              <TableCell className="text-lg">
                <VariantDetailSwitch
                  id={sku.id}
                  status={sku.status}
                  onStatusChange={(newStatus) => handleStatusChange(newStatus, sku.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
};

export default VariantDetailPage;
