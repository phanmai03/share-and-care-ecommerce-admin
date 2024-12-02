"use client";

import { ProductData } from "@/interface/product";
import React, { useState, useMemo, useCallback } from "react";

interface VariantProps {
  formData: ProductData;
  onChange: (variants: Variants[], skuList: SkuList[]) => void;
}

export interface Variants {
  name: string;
  images: string[];
  options: { value: string; image: string | null }[];
}

export interface SkuList {
  tierIndex: (number | string)[];
  isDefault: boolean;
  price: number;
  quantity: number;
}

const ProductVariants: React.FC<VariantProps> = ({ formData, onChange }) => {
  const [variantGroups, setVariantGroups] = useState<Variants[]>([
    { name: "", images: [], options: [] },
  ]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const availableGroups = ["Màu sắc", "Kích cỡ"];

  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      { name: "", images: [], options: [] },
    ]);
  };

  const updateGroupName = (id: number, name: string) => {
    setVariantGroups((prev) =>
      prev.map((group, index) =>
        index === id ? { ...group, name } : group
      )
    );
  };

  const addOptionToGroup = (groupId: number) => {
    setVariantGroups((prev) =>
      prev.map((group, index) =>
        index === groupId
          ? { ...group, options: [...group.options, { value: "", image: null }] }
          : group
      )
    );
  };

  const updateOption = (
    groupId: number,
    optionIndex: number,
    value: string
  ) => {
    setVariantGroups((prev) =>
      prev.map((group, index) =>
        index === groupId
          ? {
              ...group,
              options: group.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, value } : opt
              ),
            }
          : group
      )
    );
  };

  const updateOptionImage = (
    groupId: number,
    optionIndex: number,
    image: string
  ) => {
    setVariantGroups((prev) =>
      prev.map((group, index) =>
        index === groupId
          ? {
              ...group,
              options: group.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, image } : opt
              ),
            }
          : group
      )
    );
  };

  const removeOption = (groupId: number, optionIndex: number) => {
    setVariantGroups((prev) =>
      prev.map((group, index) =>
        index === groupId
          ? {
              ...group,
              options: group.options.filter((_, idx) => idx !== optionIndex),
            }
          : group
      )
    );
  };

  const removeVariantGroup = (id: number) => {
    setVariantGroups((prev) => prev.filter((_, index) => index !== id));
  };

  const generateGroupedCombinations = useCallback(() => {
    const groupMap = variantGroups.reduce((acc, group) => {
      if (group.name.trim() && group.options.some((opt) => opt.value.trim())) {
        acc[group.name] = group.options.filter((opt) => opt.value.trim());
      }
      return acc;
    }, {} as Record<string, { value: string; image: string | null }[]>);

    if (!groupMap["Màu sắc"] && !groupMap["Kích cỡ"]) return [];

    const primaryGroup = groupMap["Màu sắc"] || [];
    const secondaryGroup = groupMap["Kích cỡ"] || [];

    if (primaryGroup.length === 0) {
      return secondaryGroup.map((secondaryOption) => ({
        primaryOption: null,
        secondaryOption,
      }));
    }

    return primaryGroup.flatMap((primaryOption) =>
      secondaryGroup.length > 0
        ? secondaryGroup.map((secondaryOption) => ({
            primaryOption,
            secondaryOption,
          }))
        : [{ primaryOption, secondaryOption: null }]
    );
  }, [variantGroups]);

  const groupedCombinations = useMemo(() => {
    const rawCombinations = generateGroupedCombinations();
    const grouped = rawCombinations.reduce((acc, item) => {
      const { primaryOption, secondaryOption } = item;
      const key = primaryOption?.value || "";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ primaryOption, secondaryOption });
      return acc;
    }, {} as Record<string, { primaryOption: any; secondaryOption: any }[]>);

    return Object.entries(grouped).map(([key, values]) => ({
      color: values[0]?.primaryOption?.value,
      image: values[0]?.primaryOption?.image,
      sizes: values.map((value) => value.secondaryOption),
    }));
  }, [generateGroupedCombinations]);

  const notifyParent = () => {
    // Generate variants and SKU list data
    const variants = variantGroups.map((group) => ({
      name: group.name,
      images: group.images,
      options: group.options,
    }));

    const skuList = groupedCombinations.map((combination) => ({
      tierIndex: [
        combination.color,
        ...combination.sizes.map((size) => size?.value),
      ],
      isDefault: false,
      price: prices[combination.color] || 0,
      quantity: quantities[combination.color] || 0,
    }));

    // Pass the generated data back to the parent component via `onChange`
    onChange(variants, skuList);
  };

  return (
    <div>
      {variantGroups.map((group, groupId) => (
        <div
          key={groupId}
          className="p-4 mb-4 border border-gray-300 rounded-md bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <select
              value={group.name}
              onChange={(e) => updateGroupName(groupId, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>
                Chọn nhóm phân loại
              </option>
              {availableGroups.map((name) => (
                <option
                  key={name}
                  value={name}
                  disabled={!!variantGroups.find((v) => v.name === name)}
                >
                  {name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeVariantGroup(groupId)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              X
            </button>
          </div>

          {group.options.map((option, optionIndex) => (
            <div key={optionIndex} className="mb-2">
              <div className="flex items-center">
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) =>
                    updateOption(groupId, optionIndex, e.target.value)
                  }
                  placeholder="Nhập tùy chọn"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOption(groupId, optionIndex)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
              {group.name === "Màu sắc" && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateOptionImage(
                            groupId,
                            optionIndex,
                            event.target?.result as string
                          );
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  {option.image && (
                    <div className="mt-2">
                      <img
                        src={option.image}
                        alt="Uploaded"
                        className="h-16 w-16 object-cover border rounded"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addOptionToGroup(groupId)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Thêm tùy chọn
          </button>
        </div>
      ))}
      <div className="mb-4">
        <button
          type="button"
          onClick={addVariantGroup}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Thêm nhóm phân loại
        </button>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={notifyParent}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Lưu sản phẩm
        </button>
      </div>
    </div>
  );
};

export default ProductVariants;
