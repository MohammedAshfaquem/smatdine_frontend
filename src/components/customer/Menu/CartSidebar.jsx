import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Minus, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CartSidebar({ showCart, setShowCart, tableId }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  // 🛒 Fetch cart
  useEffect(() => {
    if (!tableId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/cart/${tableId}/`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartItems(data.items || []);
        setTotalAmount(data.total_amount || 0);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [tableId, showCart]);

  // 🧮 Recalculate total
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal || 0),
      0
    );
    setTotalAmount(newTotal);
  }, [cartItems]);

  // ➕➖ Update quantity
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      const res = await fetch(`${API_URL}/cart/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: tableId,
          item_id: itemId,
          quantity: newQty,
        }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQty,
                subtotal: newQty * parseFloat(item.menu_item?.price || 0),
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ❌ Remove single item
  const handleRemoveItem = async (itemId) => {
    try {
      const res = await fetch(
        `${API_URL}/cart/remove/${itemId}/?table_number=${tableId}`,
        { method: "DELETE" }
      );

      if (!res.ok && res.status !== 204)
        throw new Error("Failed to remove item");

      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // 🧹 Clear all items
  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    setClearing(true);
    try {
      await Promise.all(
        cartItems.map((item) =>
          fetch(`${API_URL}/cart/remove/${item.id}/?table_number=${tableId}`, {
            method: "DELETE",
          })
        )
      );
      setCartItems([]);
      setTotalAmount(0);
    } catch (err) {
      console.error("Error clearing cart:", err);
    } finally {
      setClearing(false);
    }
  };

  // 🚀 Go to Review Page
  const handlePlaceOrder = () => {
    setShowCart(false);
    navigate(`/review-order/${tableId}`, {
      state: { cartItems, totalAmount },
    });
  };

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
        showCart ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
        <button
          onClick={() => setShowCart(false)}
          className="text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-5 overflow-y-auto h-[calc(100%-160px)]">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-5 border-b pb-4"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {item.menu_item?.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  ₹{parseFloat(item.menu_item?.price || 0).toFixed(2)} each
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-gray-800 font-medium w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="font-semibold text-emerald-600">
                  ₹{item.subtotal}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full p-5 border-t border-gray-200 bg-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total:</span>
            <span className="text-xl font-bold text-emerald-600">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClearCart}
              disabled={clearing}
              className="w-1/3 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-60"
            >
              {clearing ? "Clearing..." : "Clear All"}
            </button>

            <button
              onClick={handlePlaceOrder}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
