import { X, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function ItemModal({ item, tableNumber, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);
  const [maxReached, setMaxReached] = useState(false);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (!item.is_custom && tableNumber) {
        try {
          const res = await axios.get(
            `${API_URL}/cart/item-quantity/${tableNumber}/`,
            { params: { menu_item_id: item.id } }
          );
          setCartQuantity(res.data.quantity || 0);
        } catch (err) {
          console.error("Failed to fetch cart quantity:", err);
        }
      }
    };
    fetchCartQuantity();
  }, [item, tableNumber]);

  useEffect(() => {
    if (item.stock !== null && item.stock !== undefined) {
      const available = item.stock - cartQuantity;
      setMaxReached(available <= 0);
    }
  }, [cartQuantity, item.stock]);

  const handleAdd = async () => {
    if (!tableNumber) {
      toast.error("No table found. Please scan QR again.");
      return;
    }

    if (maxReached) return;

    try {
      await onAddToCart(item, quantity, instructions);
      onClose();
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Cannot add more of this item — stock limit reached!");
    }
  };

  const disablePlus =
    item.stock <= 1 || maxReached || quantity + cartQuantity >= item.stock;

  const availableStock =
    item.stock !== null && item.stock !== undefined
      ? Math.max(item.stock - cartQuantity, 0)
      : "∞";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <img
          src={
            item.image
              ? `${API_URL}${item.image}`
              : "https://via.placeholder.com/400x250"
          }
          alt={item.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-2">{item.description}</p>
        <p className="text-emerald-600 font-bold text-xl mb-2">₹{item.price}</p>
        <p className="text-gray-500 text-sm mb-4">
          Available Stock: {availableStock}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">Quantity:</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 bg-gray-100 rounded-full"
              disabled={quantity <= 1}
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() =>
                !disablePlus && setQuantity((q) => Math.min(q + 1, item.stock))
              }
              className={`p-2 rounded-full ${
                disablePlus
                  ? "bg-gray-200 cursor-not-allowed opacity-50"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              title={disablePlus ? "Maximum stock reached" : ""}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Any special instructions? (e.g., less spicy, no onion)"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 mb-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />

        <button
          onClick={handleAdd}
          disabled={maxReached}
          className={`w-full py-3 text-white font-semibold rounded-xl transition-all duration-300 ${
            maxReached
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {maxReached ? "Maximum Stock Reached" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
