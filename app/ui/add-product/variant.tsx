"use client";

import React, { useState, useCallback, useMemo } from "react";

interface VariantGroup {
  id: number;
  name: string;
  options: { value: string; image: string | null }[];
}

const ProductVariants: React.FC = () => {
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([
    { id: 1, name: "", options: [] },
  ]);

  const availableGroups = ["Màu sắc", "Kích cỡ"];

  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", options: [] },
    ]);
  };

  const updateGroupName = (id: number, name: string) => {
    setVariantGroups((prev) =>
      prev.map((group) => (group.id === id ? { ...group, name } : group))
    );
  };

  const addOptionToGroup = (groupId: number) => {
    setVariantGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
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
      prev.map((group) =>
        group.id === groupId
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
      prev.map((group) =>
        group.id === groupId
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
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.filter((_, idx) => idx !== optionIndex),
            }
          : group
      )
    );
  };

  const removeVariantGroup = (id: number) => {
    setVariantGroups((prev) => prev.filter((group) => group.id !== id));
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

  return (
    <div>
      {variantGroups.map((group) => (
        <div
          key={group.id}
          className="p-4 mb-4 border border-gray-300 rounded-md bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <select
              value={group.name}
              onChange={(e) => updateGroupName(group.id, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>
                Chọn nhóm phân loại
              </option>
              {availableGroups.map((name) => (
                <option
                  key={name}
                  value={name}
                  disabled={
                    !!variantGroups.find((v) => v.name === name) &&
                    name !== group.name
                  }
                >
                  {name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeVariantGroup(group.id)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              X
            </button>
          </div>

          {group.options.map((option, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center">
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) =>
                    updateOption(group.id, index, e.target.value)
                  }
                  placeholder="Nhập tùy chọn"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOption(group.id, index)}
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
                            group.id,
                            index,
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
            onClick={() => addOptionToGroup(group.id)}
            className="mt-2 px-4 py-2 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400"
          >
            + Thêm tùy chọn
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addVariantGroup}
        className="px-4 py-2 text-sm border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400"
        disabled={variantGroups.length >= availableGroups.length}
      >
        + Thêm nhóm phân loại
      </button>

      {groupedCombinations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Danh sách phân loại hàng</h3>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Màu sắc</th>
                <th className="px-4 py-2 border">Hình ảnh</th>
                <th className="px-4 py-2 border">Kích cỡ</th>
                <th className="px-4 py-2 border">Giá</th>
                <th className="px-4 py-2 border">Kho hàng</th>
              </tr>
            </thead>
            <tbody>
              {groupedCombinations.map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {group.sizes.map((size, sizeIdx) => (
                    <tr key={sizeIdx}>
                      {sizeIdx === 0 && (
                        <>
                          <td
                            className="px-4 py-2 border"
                            rowSpan={group.sizes.length}
                          >
                            {group.color}
                          </td>
                          <td
                            className="px-4 py-2 border"
                            rowSpan={group.sizes.length}
                          >
                            {group.image && (
                              <img
                                src={group.image}
                                alt="Uploaded"
                                className="h-10 w-10 object-cover"
                              />
                            )}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-2 border">{size?.value}</td>
                      <td className="px-4 py-2 border">
                        <input
                          type="text"
                          placeholder="Nhập giá"
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="text"
                          placeholder="Nhập kho hàng"
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;
