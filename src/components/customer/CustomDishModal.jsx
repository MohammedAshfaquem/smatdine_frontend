import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CustomDishModal({ dish, onClose, onAddToCart, fetchCartCount }) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  const BASE_URL = "http://127.0.0.1:8000";

  // ✅ Get table number from localStorage
  const storedTable = localStorage.getItem("tableId");
  const tableNumber = storedTable ? parseInt(storedTable, 10) : null;

  const handleAddToCart = async () => {
    if (!tableNumber) {
      toast.error("No table found. Please scan QR again.");
      return;
    }

    try {
      const payload = {
        table_number: tableNumber,
        custom_dish_id: dish.id,
        quantity,
        special_instructions: instructions || "",
        is_custom: true,
      };

      const response = await axios.post(`${BASE_URL}/cart/add/`, payload);

      toast.success(response.data.message || "Added to cart");

      // Update parent cart
      onAddToCart?.(dish, quantity, instructions, dish.dish_ingredients);
      fetchCartCount?.();
      onClose();
    } catch (error) {
      console.error("Add custom dish to cart failed:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to add custom dish to cart");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <img
          src={dish.image_url || "https://via.placeholder.com/400x250"}
          alt={dish.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        {/* Dish Info */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{dish.name}</h2>
        <p className="text-emerald-600 font-bold text-xl mb-4">
          ₹{dish.total_price || 0}
        </p>

        {/* Ingredients */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Ingredients</h3>
          {dish.dish_ingredients?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dish.dish_ingredients.map((ing) => (
                <span
                  key={ing.id}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm"
                >
                  {ing.ingredient.name} x{ing.quantity} (₹{ing.ingredient.price * ing.quantity})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No ingredients available</p>
          )}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">Quantity:</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Any special instructions?"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 mb-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
