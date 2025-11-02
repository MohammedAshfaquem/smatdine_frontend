import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ReviewOrder() {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // 🛒 Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/cart/${tableId}/`);
        const data = await res.json();
        setCartItems(data.items || []);
        setTotal(data.total_amount || 0);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [tableId]);

  // ✅ Place order
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/order/place/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableId }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      toast.success("Order placed successfully!");

      // navigate with order details
      navigate(`/order-tracking/${data.order.id}`, {
        state: { order: data.order },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-2xl w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Review Your Order
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center">No items in your cart.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.menu_item?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₹
                      {parseFloat(item.menu_item?.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    ₹{item.subtotal}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-gray-700 text-lg">
                Total:
              </span>
              <span className="text-xl font-bold text-emerald-600">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-1/3 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition"
              >
                Back to Cart
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
              >
                Confirm & Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
