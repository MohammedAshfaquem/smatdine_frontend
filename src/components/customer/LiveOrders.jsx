import { useEffect, useState } from "react";
import { Eye, CheckCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LiveOrders({ tableId }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // 🔁 Fetch orders periodically
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${tableId}/`);
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
        else setOrders([]);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load live orders");
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [tableId]);

  // 🧭 Navigate to order tracking page
  const handleViewDetails = (order) => {
    navigate(`/order-tracking/${order.id}`, { state: { order } });
  };

  // ⏱️ Determine progress based on order status
  const getProgress = (status) => {
    switch (status) {
      case "pending":
      case "received":
        return 25;
      case "preparing":
        return 50;
      case "ready":
        return 75;
      case "served":
        return 100;
      default:
        return 0;
    }
  };

  // 🧩 Fallback if no orders
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-2xl font-bold text-[#059669] mb-2">
          🕒 Live Order Tracking
        </h2>
        <p>No active orders for this table.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-10 py-8">
      <h2 className="text-2xl font-bold text-[#059669] mb-2">Live Order Tracking</h2>
      <p className="text-gray-500 mb-8">Monitor your orders in real-time</p>

      {/* 2 orders per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => {
          const total = Number(order.total || 0).toFixed(2);
          const progress = getProgress(order.status);

          // Pick the first item for preview
          const firstItem = order.items?.[0];

          let imageUrl = "https://cdn-icons-png.flaticon.com/512/1046/1046784.png";
          let itemName = "Custom Order";
          let itemDesc = "";

          if (firstItem) {
            if (firstItem.type === "menu_item") {
              // ✅ Regular menu item
              imageUrl = firstItem.image
                ? `${API_URL}${firstItem.image}`
                : "https://cdn-icons-png.flaticon.com/512/1046/1046784.png";
              itemName = firstItem.name || "Food Item";
              itemDesc = `Qty: ${firstItem.quantity}`;
            } else if (firstItem.type === "custom_dish") {
              // ✅ Custom dish (no image, but list ingredients)
              itemName = firstItem.name || "Custom Dish";
              const ingredientNames = firstItem.ingredients
                ?.map((ing) => `${ing.name} (${ing.quantity})`)
                .join(", ");
              itemDesc = `Ingredients: ${ingredientNames || "N/A"}`;
              imageUrl =
                "https://cdn-icons-png.flaticon.com/512/3175/3175148.png"; // 🥗 custom dish icon
            }
          }

          return (
            <div
              key={order.id}
              className="bg-white border border-[#059669]/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  Order <span className="text-gray-600">#{order.id}</span>
                </h3>

                <span
                  className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                    order.status === "pending" || order.status === "received"
                      ? "bg-[#D1FAE5] text-[#059669]"
                      : order.status === "preparing"
                      ? "bg-[#FEF9C3] text-[#CA8A04]"
                      : order.status === "ready"
                      ? "bg-[#DBEAFE] text-[#2563EB]"
                      : "bg-[#DCFCE7] text-[#16A34A]"
                  }`}
                >
                  {order.status === "preparing" ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Total */}
              <div className="text-right text-gray-700 font-semibold mb-3">
                ₹{total}
              </div>

              {/* Table & Items */}
              <p className="text-sm text-gray-500 mb-1">
                Table {order.table_number || order.table} •{" "}
                {order.items?.length || 0} item
                {order.items?.length > 1 ? "s" : ""}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="h-2 rounded-full bg-[#059669]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Item Preview */}
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={imageUrl}
                  alt={itemName}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <p className="text-gray-800 font-medium">{itemName}</p>
                  <p className="text-sm text-gray-500">{itemDesc}</p>
                </div>
              </div>

              {/* View Button */}
              <button
                onClick={() => handleViewDetails(order)}
                className="w-full flex justify-center items-center gap-2 border border-[#059669]/40 text-[#059669] py-2 rounded-xl hover:bg-[#059669]/10 transition"
              >
                <Eye size={16} />
                View Full Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
