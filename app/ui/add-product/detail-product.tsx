import React, { useState, useEffect } from "react";
import { getAllCategories, getChildCategories } from "@/app/api/category";
import { toast } from "react-toastify";
import { Category, ProductData} from "@/interface/product";

// Define prop types
interface ProductFormProps {
  formData: ProductData;
  onChange: (name: string, description: string, category: Category[], attributes: string[]) => void;
}

const CreateProductForm: React.FC<ProductFormProps> = ({ formData, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attributeInput, setAttributeInput] = useState<string>("");

  const [currentFormData, setCurrentFormData] = useState({
    name: formData?.name || "",
    description: formData?.description || "",
    category: formData?.category || [],
    attributes: formData?.attributes || [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);

        const childDataPromises = data.map(async (parentCategory) => {
          const children = await getChildCategories(parentCategory.id);
          return { [parentCategory.id]: children };
        });

        const childDataArray = await Promise.all(childDataPromises);
        const childDataObject = childDataArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setChildCategories(childDataObject);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      onChange(updatedData.name, updatedData.description, updatedData.category, updatedData.attributes);
      return updatedData;
    });
  };

  const handleAttributeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttributeInput(e.target.value);
  };

  const handleAttributeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedInput = attributeInput.trim();
      if (trimmedInput && !currentFormData.attributes.includes(trimmedInput)) {
        setCurrentFormData((prev) => {
          const updatedAttributes = [...prev.attributes, trimmedInput];
          onChange(prev.name, prev.description, prev.category, updatedAttributes);
          return { ...prev, attributes: updatedAttributes };
        });
        setAttributeInput("");
      }
    }
  };

  const removeAttribute = (attr: string) => {
    const updatedAttributes = currentFormData.attributes.filter((a) => a !== attr);
    setCurrentFormData((prev) => {
      onChange(prev.name, prev.description, prev.category, updatedAttributes);
      return { ...prev, attributes: updatedAttributes };
    });
  };

  const handleParentCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedParentCategory(selectedId);

    const parentCategory = categories.find((cat) => cat.id === selectedId);
    if (parentCategory && !currentFormData.category.some((c) => c.id === parentCategory.id)) {
      const updatedCategories = [...currentFormData.category, parentCategory];
      setCurrentFormData((prev) => {
        onChange(prev.name, prev.description, updatedCategories, prev.attributes);
        return { ...prev, category: updatedCategories };
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const isSelected = currentFormData.category.some((cat) => cat.id === categoryId);
    const selectedCategory =
      categories.find((cat) => cat.id === categoryId) ||
      Object.values(childCategories).flat().find((cat) => cat.id === categoryId);

    if (isSelected) {
      const updatedCategories = currentFormData.category.filter((cat) => cat.id !== categoryId);
      setCurrentFormData((prev) => {
        onChange(prev.name, prev.description, updatedCategories, prev.attributes);
        return { ...prev, category: updatedCategories };
      });
    } else if (selectedCategory) {
      const updatedCategories = [...currentFormData.category, selectedCategory];
      setCurrentFormData((prev) => {
        onChange(prev.name, prev.description, updatedCategories, prev.attributes);
        return { ...prev, category: updatedCategories };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", currentFormData);
    // Handle form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
        <h2 className="text-lg font-semibold mb-4">Add Product</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={currentFormData.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Product description"
            value={currentFormData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Category</label>
          {isLoading ? (
            <p>Loading categories...</p>
          ) : (
            <select
              name="parentCategory"
              value={selectedParentCategory || ""}
              onChange={handleParentCategorySelect}
              className="w-full mt-1 p-2 border rounded-md shadow-sm"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
        </div>

        {selectedParentCategory && childCategories[selectedParentCategory] && (
          <div>
            <div className="space-y-2 ml-4">
              {childCategories[selectedParentCategory].map((child) => (
                <div key={child.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={child.id}
                    onChange={() => handleCategoryChange(child.id)}
                    checked={currentFormData.category.some((c) => c.id === child.id)}
                    className="mr-2"
                  />
                  <label htmlFor={child.id}>{child.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentFormData.category?.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {currentFormData.category.map((cat) => (
              <li key={cat.id} className="flex items-center bg-gray-200 px-3 py-1 rounded-md space-x-2">
                <span>{cat.name}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className="text-red-500 ml-2 focus:outline-none"
                  aria-label={`Remove ${cat.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Attributes</label>
          <div className="flex flex-wrap gap-2 p-2 border rounded-md shadow-sm bg-gray-50">
            {currentFormData.attributes?.map((attr, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {attr}
                <button
                  type="button"
                  onClick={() => removeAttribute(attr)}
                  className="ml-2 text-red-500 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
            <input
              type="text"
              value={attributeInput}
              onChange={handleAttributeInput}
              onKeyDown={handleAttributeKeyDown}
              placeholder="Add attributes and press Enter"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
      {/* </form> */}
    </div>
  );
};

export default CreateProductForm;
