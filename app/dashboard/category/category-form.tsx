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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        } catch {
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
    <div className="flex justify-left items-start min-h-screenp-10 mt-10">
      <div className="bg-white rounded-none shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <Table>
          <TableHeader>
            <TableRow  className="bg-gray-100">
              <TableHead className="text-lg">Name</TableHead>
              <TableHead className="text-lg">Action</TableHead>
              <TableHead className="text-lg"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <Fragment key={category.id}>
                <TableRow>
                  <TableCell className="text-lg">{category.name}</TableCell>
                  <TableCell className="text-lg">
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
                  </TableCell>
                  <TableCell className="text-lg">
                    <button
                      onClick={() => handleToggleExpand(category.id)}
                      className="text-black hover:underline"
                    >
                      {expandedCategory === category.id ? <GoChevronUp /> : <GoChevronDown />}
                    </button>
                  </TableCell>
                </TableRow>
                {expandedCategory === category.id &&
                  childCategories[category.id]?.map((child) => (
                    <TableRow key={child.id} className="bg-gray-100">
                      <TableCell className="text-lg">{child.name}</TableCell>
                      <TableCell className="text-lg">
                        <button
                          onClick={() => handleEdit(child)}
                          className="bg-teal-500  text-white p-2 rounded-lg mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(child.id)}
                          className="bg-red-500 text-white p-2 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>

      </div>

      <div className="bg-white rounded-lgz shadow-md p-6 w-full max-w-md mx-auto">
        <CategoryForm category={editingCategory} onSubmit={fetchCategories} />
      </div>
    </div>
  );
}
