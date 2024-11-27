"use client";

import { Fragment, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CategoryDataResponse } from "@/interface/category";
import { getAllCategories, getChildCategories } from "@/app/api/category";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { toast } from "react-toastify";
import CategoryForm from "@/app/ui/category/category-form"

export default function Page() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // ID của category đang mở
  const [childCategories, setChildCategories] = useState<Record<string, Array<CategoryDataResponse>>>({}); // Lưu các danh mục con

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        toast.error(`Error fetching categories: ${error}`);
      }
    };

    fetchCategories();
  }, []);

  const handleToggleExpand = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      // Đóng nếu đã mở
      setExpandedCategory(null);
    } else {
      // Mở danh mục mới
      setExpandedCategory(categoryId);

      // Chỉ tải danh mục con nếu chưa tải trước đó
      if (!childCategories[categoryId]) {
        try {
          const response = await getChildCategories(categoryId);
          setChildCategories((prev) => ({
            ...prev,
            [categoryId]: response,
          }));
        } catch (error) {
          toast.error(`Error fetching child categories: ${error}`);
        }
      }
    }
  };

  const handleEdit = (category: CategoryDataResponse) => {
    console.log("Edit category:", category);
    // Add logic for editing
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Delete category with ID:", id);
      // Add API delete logic here
    } catch (error) {
      toast.error(`Error deleting category: ${error}`);
    }
  };

  return (
    <div className="flex justify-left items-start min-h-screen bg-gray-100 p-10 mt-10">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <table className="table-auto w-full text-lg text-left border-collapse">
          <thead>
            <tr>
              <th className="w-1/6 py-2 px-4 border-b">ID</th>
              <th className="w-1/2 py-2 px-4 border-b">Name</th>
              <th className="w-1/4 py-2 px-4 border-b">Action</th>
              <th className="w-1/12 py-2 px-4 border-b text-center">Expand</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <Fragment key={category.id}>
                {/* Row for parent category */}
                <tr>
                  <td className="py-2 px-4 border-b">{category.id}</td>
                  <td className="py-2 px-4 border-b">{category.name}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-teal-500 text-white p-2 rounded-md mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleToggleExpand(category.id)}
                      className="text-blue-500 hover:underline"
                    >
                      {expandedCategory === category.id ? (
                        <GoChevronUp />
                      ) : (
                        <GoChevronDown />
                      )}
                    </button>
                  </td>
                </tr>

                {/* Rows for child categories */}
                {expandedCategory === category.id &&
                  childCategories[category.id]?.map((child) => (
                    <tr key={child.id} className="bg-gray-50">
                      <td className="py-2 px-4 border-b pl-8">{child.id}</td>
                      <td className="py-2 px-4 border-b">{child.name}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(child)}
                          className="bg-teal-500 text-white p-2 rounded-md mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(child.id)}
                          className="bg-red-500 text-white p-2 rounded-md"
                        >
                          <FaTrash />
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b"></td>
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <CategoryForm />
      </div>
    </div>
  );
}
