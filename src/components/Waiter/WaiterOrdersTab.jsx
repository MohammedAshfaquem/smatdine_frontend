import { useEffect, useState } from "react";
import api from "../../api/staff";
import { toast } from "react-toastify";

export default function WaiterOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReadyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("waiter/orders/ready/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch ready orders");
    } finally {
      setLoading(false);
    }
  };

  const markAsServed = async (orderId) => {
    try {
      await api.patch(`waiter/orders/${orderId}/served/`);
      toast.success(`Order ${orderId} marked as served`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchReadyOrders();
    const interval = setInterval(fetchReadyOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">🍽️ Ready to Serve Orders</h2>
      {loading ? (
        <p className="text-gray-500 text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No ready orders at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-[#059669] mb-2">
                Table {order.table_number}
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
                onClick={() => markAsServed(order.id)}
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
