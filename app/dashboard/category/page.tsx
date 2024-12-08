"use client";
import { Fragment, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CategoryDataResponse } from "@/interface/category";
import {
  deleteCategories,
  getAllCategories,
  getChildCategories,
} from "@/app/api/category";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { toast } from "react-toastify";
import CategoryForm from "@/app/ui/category/category-form";

export default function Page() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [childCategories, setChildCategories] = useState<
    Record<string, Array<CategoryDataResponse>>
  >({});
  const [editingCategory, setEditingCategory] = useState<CategoryDataResponse | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      const parents = response.filter((category) => !category.parentId);
      setCategories(parents);
    } catch {
      toast.error("Error fetching categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle child categories for a parent category
  const handleToggleExpand = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      if (!childCategories[categoryId]) {
        try {
          const response = await getChildCategories(categoryId);
          setChildCategories((prev) => ({
            ...prev,
            [categoryId]: response,
          }));
        } catch{
          toast.error("Error fetching child categories.");
        }
      }
    }
  };

  // Handle edit action
  const handleEdit = (category: CategoryDataResponse) => {
    setEditingCategory(category);
  };

  // Handle delete action
  const handleDelete = async (categoryId: string) => {
    if (!accessToken || !userId) {
      toast.error("Missing required data.");
      return;
    }
    try {
      await deleteCategories(categoryId, userId, accessToken);
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Error deleting category.");
    }
  };

  return (
    <div className="flex justify-left items-start min-h-screen bg-gray-100 p-10 mt-10">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <table className="table-auto w-full text-lg text-left border-collapse">
          <thead>
            <tr>
              {/* <th className="w-1/6 py-2 px-4 border-b">ID</th> */}
              <th className="w-1/2 py-2 px-4 border-b">Name</th>
              <th className="w-1/4 py-2 px-4 border-b">Action</th>
              <th className="w-1/12 py-2 px-4 border-b text-center"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <Fragment key={category.id}>
                <tr>
                  {/* <td className="py-2 px-4 border-b">{category.id}</td> */}
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
                      className="text-black text-cen hover:underline"
                    >
                      {expandedCategory === category.id ? (
                        <GoChevronUp />
                      ) : (
                        <GoChevronDown />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedCategory === category.id &&
                  childCategories[category.id]?.map((child) => (
                    <tr key={child.id} className="bg-slate-400">
                      {/* <td className="py-2 px-4 border-b pl-8">{child.id}</td> */}
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

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
        <CategoryForm category={editingCategory} onSubmit={fetchCategories} />
      </div>
    </div>
  );
}
