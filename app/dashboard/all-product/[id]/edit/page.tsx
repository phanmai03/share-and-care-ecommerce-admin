"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/app/ui/heading";
import Detail from "@/app/ui/edit-product/detail-product";
import Images from "@/app/ui/edit-product/image-upload";
import Property from "@/app/ui/edit-product/property";
import { toast } from "react-toastify";
import { getProductDetail, updateProduct } from "@/app/api/product";
import { ProductData, ProductDataDetailResponse, ProductDataEdit, SkuList, SkuListData } from "@/interface/product";
import ProductVariants from "@/app/ui/edit-product/variant";
import { useParams, useRouter } from "next/navigation";
import PublicProduct from "@/app/ui/edit-product/publish-product";

const transformSkuList = (skuListData: SkuListData[]): SkuList[] => {
  return skuListData.map((sku) => ({
    tierIndex: sku.tierIndex,
    isDefault: sku.isDefault,
    price: sku.price,
    quantity: sku.quantity,
  }));
};

const Page = () => {
  const [product, setProduct] = useState<ProductDataDetailResponse>();
  const [formData, setFormData] = useState<ProductDataEdit>({
    productId: "",
    name: "",
    description: "",
    category: [],
    attributes: [],
    mainImage: "",
    subImages: [],
    price: 0,
    originalPrice: 0,
    quantity: 0,
    variants: [],
    skuList: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const param = useParams();
  const id = param.id;

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (typeof id !== "string") {
        setLoading(false);
        return;
      }
      if (userId && accessToken) {
        try {
          const response = await getProductDetail(id, userId, accessToken);
          setProduct(response);
          setFormData({
            productId: id,
            name: response.product.name || "",
            description: response.product.description || "",
            category: response.product.category || [],
            attributes: response.product.attributes || [],
            mainImage: response.product.mainImage || "",
            subImages: response.product.subImages || [],
            price: response.product.price || 0,
            originalPrice: response.product.originalPrice || 0,
            quantity: response.product.quantity || 0,
            variants: response.product.variants || [],
            skuList: response.skuList ? transformSkuList(response.skuList.skuList) : [],
          });
        } catch {
          toast.error("Error fetching product details.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accessToken, id, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !accessToken) {
      toast.error("Missing authentication information. Please log in again.");
      return;
    }

    const requiredStringFields: (keyof ProductData)[] = ["name", "description", "mainImage"];

    for (const field of requiredStringFields) {
      if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
        toast.error(`Please fill in the ${field}.`);
        return;
      }
    }

    const numericFields: (keyof ProductData)[] = ["price", "originalPrice", "quantity"];
    for (const field of numericFields) {
      const value = formData[field];
      if (typeof value !== "number" || value <= 0) {
        toast.error(`${field} must be a number greater than 0.`);
        return;
      }
    }

    try {
      await updateProduct({ ...formData }, userId, accessToken);
      toast.success("Product updated successfully!");
      router.push("/dashboard/all-product");
    } catch (error) {
      toast.error(`Error updating product: ${error}`);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Heading title="Edit Product" />
      <div className="flex justify-between items-center mt-6">
        {/* Nút Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Back
        </button>
      </div>
      <div className="flex justify-center items-center mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white max-w-4xl w-full p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
              <Detail formData={formData} setFormData={setFormData} />
              <Images formData={formData} setFormData={setFormData} />
              <Property formData={formData} setFormData={setFormData} />
              <ProductVariants formData={formData} setFormData={setFormData} />
              <PublicProduct id={id} status={product?.product.status} />
              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#38A59F] text-white rounded-lg shadow hover:bg-[#2F8F8A] transition"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
