import { useEffect, useState, useContext } from "react";
import api from "../../api/staff";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function WaiterOrdersTab() {
  const { user } = useContext(AuthContext); // current logged-in waiter
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch today's ready orders
  const fetchReadyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("orders/filter/?status=ready&today=true");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Ready Orders Error:", err);
      toast.error("Failed to fetch ready orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark order as served
  const markAsServed = async (orderId, currentWaiter) => {
    try {
      const res = await api.patch(`waiter/orders/${orderId}/mark-served/`);

      // Always use backend response, fallback to current tab waiter
      const servedBy = res?.data?.served_by || currentWaiter?.username || "Waiter";

      toast.success(`Order ${orderId} marked as served by ${servedBy}`);

      // Remove served order from list in this tab only
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Mark as Served Error:", err);
      const msg = err.response?.data?.error || "Failed to update order status";
      toast.error(msg);
    }
  };

  // ✅ Polling to refresh ready orders every 10s
  useEffect(() => {
    fetchReadyOrders();
    const interval = setInterval(fetchReadyOrders, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">🍽️ Ready Orders (Today)</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No ready orders for today.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-[#059669] mb-2">
                Table {order.table?.number || order.table_number}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                ETA: {order.estimated_time} min | Total: ₹{order.total}
              </p>
              <ul className="mb-3">
                {order.items.map((item) => (
                  <li key={item.id} className="text-sm text-[#1F2937]">
                    • {item.menu_item_name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => markAsServed(order.id, user)}
                className="bg-[#FACC15] text-[#1F2937] font-semibold px-4 py-2 rounded-xl w-full hover:bg-yellow-400 transition"
              >
                Mark as Served ✅
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
