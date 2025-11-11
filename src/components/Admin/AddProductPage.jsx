import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  FileText,
  DollarSign,
  Package,
  Upload,
  Tag,
  AlertCircle,
} from "lucide-react";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "starter",
    type: "veg",
    spice_level: 0,
    customizable: false,
    stock: "",
    availability: true,
    preparation_time: 10,
    min_stock: 5,
    price: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const categories = [
    { value: "starter", label: "Starter" },
    { value: "main", label: "Main Course" },
    { value: "dessert", label: "Dessert" },
    { value: "drink", label: "Drink" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "spice_level" ? parseInt(value) : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Stock quantity is required";
    if (!formData.image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/menu/", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      if (res.ok) {
        toast.success("Product added successfully!");
        navigate("/products");
      } else {
        const err = await res.json();
        console.error(err);
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Create a new menu item
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
          >
            <Check className="w-5 h-5" />
            Save Product
          </button>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-sm text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Veg Burger"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-sm text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your dish..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-sm text-gray-700">
                    Spice Level
                  </label>
                  <select
                    name="spice_level"
                    value={formData.spice_level}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>No Spice</option>
                    <option value={1}>Mild</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Hot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                Pricing
              </h2>
              <div>
                <label className="font-semibold text-sm text-gray-700">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.price}
                  </p>
                )}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
                <Package className="w-5 h-5 text-purple-600" />
                Inventory
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-sm text-gray-700">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="font-semibold text-sm text-gray-700">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    name="min_stock"
                    value={formData.min_stock}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-sm text-gray-700">
                    Preparation Time (min)
                  </label>
                  <input
                    type="number"
                    name="preparation_time"
                    value={formData.preparation_time}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="customizable"
                    checked={formData.customizable}
                    onChange={handleInputChange}
                  />
                  Customizable
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleInputChange}
                  />
                  Available
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
                <Upload className="w-5 h-5 text-orange-600" />
                Product Image
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag an image
                  </p>
                </label>
              </div>

              {previewImage && (
                <div className="mt-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                </div>
              )}
              {errors.image && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 mb-4">
                <Tag className="w-5 h-5 text-indigo-600" />
                Quick Summary
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {formData.name || "—"}
                </p>
                <p>
                  <strong>Category:</strong> {formData.category}
                </p>
                <p>
                  <strong>Price:</strong> ${formData.price || "0.00"}
                </p>
                <p>
                  <strong>Stock:</strong> {formData.stock || "0"} units
                </p>
                <p>
                  <strong>Available:</strong>{" "}
                  {formData.availability ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
