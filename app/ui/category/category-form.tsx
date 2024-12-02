import { useState, useEffect } from "react";
import { CategoryData, CategoryDataResponse } from "@/interface/category";
import { toast } from "react-toastify";
import { createCategories, getAllCategories, updateCategories } from "@/app/api/category";

interface CategoryFormProps {
  category: CategoryDataResponse | null;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryData>({
    name: "",
    parentId: null, // Allow null for no parent category
  });
  const [categories, setCategories] = useState<CategoryDataResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const id = process.env.NEXT_PUBLIC_ADMIN_ID;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value, // Convert "" to null for parentId
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (id && accessToken) {
        const payload = {
          name: formData.name,
          parentId: formData.parentId || null, // Ensure parentId is either a string or null
        };
  
        if (category) {
          // Include categoryId explicitly in the payload for updates
          await updateCategories(
            { ...payload, categoryId: category.id }, // Use category.id, not formData.categoryId
            id,
            accessToken
          );
          toast.success("Category updated successfully.");
        } else {
          // Create category
          await createCategories(payload, id, accessToken);
          toast.success("Category added successfully.");
        }
  
        // Reset form after success
        setFormData({ name: "", parentId: null });
      } else {
        toast.error("Missing ID or access token.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            value={formData.parentId ?? ""} // Display null as empty string
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
