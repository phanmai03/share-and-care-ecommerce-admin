"use client"
import { useState, useEffect } from "react";
import { CategoryData, CategoryDataResponse } from "@/interface/category";
import { toast } from "react-toastify";
import { createCategories, getAllCategories, updateCategories } from "@/app/api/category";

interface CategoryFormProps {
  category: CategoryDataResponse | null;
  onSubmit: () => void;  // Add the onSubmit prop
}

export default function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryData>({
    name: "",
    parentId: null,
  });
  const [categories, setCategories] = useState<CategoryDataResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();

    if (category) {
      setFormData({
        name: category.name,
        parentId: category.parentId || null,
      });
    } else {
      setFormData({
        name: "",
        parentId: null,
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userId && accessToken) {
        const payload = {
          name: formData.name,
          parentId: formData.parentId || null,
        };

        if (category) {
          // Update the category
          await updateCategories({ ...payload, categoryId: category.id }, userId, accessToken);
          toast.success("Category updated successfully.");
        } else {
          // Create a new category
          await createCategories(payload, userId, accessToken);
          toast.success("Category added successfully.");
        }

        // Reset the form and trigger re-fetch
        setFormData({ name: "", parentId: null });
        onSubmit(); // Trigger re-fetch of categories
        
        // Reset the `category` to null to switch back to "Add Category" mode
        if (category) {
          // If editing, return to "Add Category" mode
          onSubmit(); // You can also pass a callback to reset `category` if needed
        }

      } else {
        toast.error("Missing ID or access token.");
      }
    } catch (error) {
      toast.error("Error submitting category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
      <h3 className="text-lg font-semibold mb-4">
        {category ? "Edit Category" : "Add Category"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="parentId" className="block text-sm font-medium">
            Parent Category
          </label>
          <select
            id="parentId"
            name="parentId"
            value={formData.parentId ?? ""}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-teal-500 text-white rounded-md"
        >
          {loading
            ? "Saving..."
            : category
            ? "Update Category"
            : "Add Category"}
        </button>
      </form>
    </div>
  );
}
