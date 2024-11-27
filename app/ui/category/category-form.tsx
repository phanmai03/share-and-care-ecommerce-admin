import { useState, useEffect } from "react";
import { CategoryData, CategoryDataResponse } from "@/interface/category";
import { toast } from "react-toastify";
import { createCategories, getAllCategories } from "@/app/api/category";

export default function CategoryForm() {
  const [formData, setFormData] = useState<CategoryData>({
    name: "",
    parentId:"",
  });
  const [categories, setCategories] = useState<CategoryDataResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all categories for the parent dropdown
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(formData)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createCategories(formData);

      toast.success("Category added successfully.");
      setFormData({ name: "", parentId: "" }); // Reset form
    } catch (error) {
      toast.error("Error creating category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg w-full">
      <h2 className="text-lg font-semibold mb-4">Create Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Parent Category Select */}
        <div className="mb-4">
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
            Parent Category
          </label>
          <select
            id="parentId"
            name="parentId"
            value={formData.parentId !== null ? formData.parentId : "None"}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-6 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
          >
            {loading ? "Processing..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
