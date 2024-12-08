import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProductData, Variants, SkuList } from "@/interface/product";
import { toast } from "react-toastify";
import { uploadProductImage } from "@/app/api/upload";

interface VariantProps {
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>;
}

const ProductVariants: React.FC<VariantProps> = ({ setFormData }) => {
  const initialVariants: Variants[] = [
    {
      name: "Color",
      images: [],
      options: [""],
    },
    {
      name: "Size",
      images: [],
      options: [""],
    },
  ];
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  

  const [variants, setVariants] = useState<Variants[]>(initialVariants);
  const [skuList, setSkuList] = useState<SkuList[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<{ color: string, size: string, price: number, quantity: number }[]>([]);

  const updateOption = (variantIndex: number, optionIndex: number, value: string) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options[optionIndex] = value;
    setVariants(newVariants);
  };

  const addOption = (index: number) => {
    const lastOption = variants[index].options[variants[index].options.length - 1];

    if (lastOption.trim() === "") {
      toast.error("Cannot add option. Please fill the last option first.");
      return;
    }

    const newVariants = [...variants];
    newVariants[index].options.push("");

    // Update the variant combinations and SKU list
    const colorOptions = newVariants[0].options.filter(option => option.trim() !== "");
    const sizeOptions = newVariants[1].options.filter(option => option.trim() !== "");

    const newCombinations: { color: string, size: string, price: number, quantity: number }[] = [];
    const newSkuList: SkuList[] = [];

    colorOptions.forEach((color, colorIndex) => {
      sizeOptions.forEach((size, sizeIndex) => {
        const combinationExists = variantCombinations.some(comb => comb.color === color && comb.size === size);
        if (!combinationExists) {
          newCombinations.push({ color, size, price: 0, quantity: 0 });
          newSkuList.push({
            tierIndex: [colorIndex, sizeIndex],
            isDefault: true,
            price: 0,
            quantity: 0,
          });
        }
      });
    });

    setVariantCombinations(prev => [...prev, ...newCombinations]);
    setSkuList(prev => [...prev, ...newSkuList]);
    setVariants(newVariants);
    toast.success("Add variant successful!");
  };

  const deleteOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setVariants(newVariants);

    toast.success("Option deleted successfully!");
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2MB and will not be uploaded.");
      return;
    }

    if (userId && accessToken) {
      try {
        const uploadedImageUrl = await uploadProductImage({ file }, userId, accessToken);
        const imageUrlString = uploadedImageUrl.toString();

        // Update the Color variant images without duplicating
        setVariants((prevVariants) => {
          const newVariants = [...prevVariants];
          const colorVariantIndex = newVariants.findIndex(v => v.name === "Color");

          if (!newVariants[colorVariantIndex].images.includes(imageUrlString)) {
            newVariants[colorVariantIndex].images.push(imageUrlString);
          }

          return newVariants;
        });

        // Update formData
        setFormData((prev: ProductData) => {
          if (!prev.mainImage) {
            return {
              ...prev,
              mainImage: imageUrlString,
            } as ProductData;
          } else {
            return {
              ...prev,
              subImages: [...prev.subImages, imageUrlString],
            } as ProductData;
          }
        });

        toast.success("Image uploaded successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to upload image.");
      }
    }
  };

  useEffect(() => {
    const filteredVariants = variants.map(variant => ({
      ...variant,
      options: variant.options.filter(option => option.trim() !== "")
    }));

    setFormData((prevFormData) => ({ ...prevFormData, variants: filteredVariants, skuList }));
  }, [variants, skuList, setFormData]);

  const handleInputChange = (index: number, field: 'price' | 'quantity', value: string) => {
    const newCombinations = [...variantCombinations];
    const parsedValue = field === 'price' ? parseFloat(value) : parseInt(value, 10);
    newCombinations[index][field] = isNaN(parsedValue) ? 0 : parsedValue;

    // Update SKU list for the corresponding combination
    const newSkuList = [...skuList];
    newSkuList[index].price = newCombinations[index].price;
    newSkuList[index].quantity = newCombinations[index].quantity;

    setVariantCombinations(newCombinations);
    setSkuList(newSkuList);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-lg font-semibold">Product Variants</h2>
      {variants.map((variant, index) => (
        <div key={index} className="p-4 border border-gray-300 rounded-md bg-gray-50">
          <h4 className="font-semibold">{variant.name}</h4>
          {variant.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                placeholder={`Enter ${variant.name} option`}
                className="w-full mt-1 p-2 border rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => deleteOption(index, optionIndex)}
                className="text-red-500 hover:text-red-700"
              >
                &times; {/* Cross icon for delete */}
              </button>
            </div>
          ))}
          {variant.name === "Color" && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 p-2 border rounded-md shadow-sm"
              />
              <div className="grid grid-cols-5 gap-4 mt-2">
                {variant.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="mt-2">
                    <Image
                      src={image}
                      alt="Uploaded"
                      className="object-cover border rounded"
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => addOption(index)}
            disabled={variant.name === "Color" && variant.options.length !== variant.images.length}
            className={`px-4 py-2 mt-4 text-sm border border-dashed border-gray-300 rounded-md ${variant.name === "Color" && variant.options.length !== variant.images.length ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:border-gray-400'}`}
          >
            + Add Option
          </button>
        </div>
      ))}

      <h3 className="mt-6 text-lg font-semibold">Variant Combinations</h3>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-lg">Color</th>
            <th className="border border-gray-300 p-2 text-lg">Size</th>
            <th className="border border-gray-300 p-2 text-lg">Price</th>
            <th className="border border-gray-300 p-2 text-lg">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {variantCombinations.map((combination, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2 text-lg">{combination.color}</td>
              <td className="border border-gray-300 p-2 text-lg">{combination.size}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={combination.price}
                  onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                  className="w-full p-1 border rounded text-lg"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={combination.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                  className="w-full p-1 border rounded text-lg"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductVariants;