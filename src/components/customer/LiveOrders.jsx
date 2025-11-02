import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LiveOrders({ tableId }) {
  const [orders, setOrders] = useState([]);

  // Fetch all orders for this table
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${tableId}/`);
        const data = await res.json();

        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, [tableId]);

  // Map statuses to steps
  const getSteps = (status, createdAt) => {
    const steps = [
      { label: "Order received", time: createdAt },
      { label: "Chef started preparing your order", offset: 2 },
      { label: "Your order is ready!", offset: 5 },
      { label: "Order served. Enjoy your meal!", offset: 7 },
    ];

    // Determine visible steps based on status
    let visibleCount = 1;
    if (status === "preparing") visibleCount = 2;
    if (status === "ready") visibleCount = 3;
    if (status === "served") visibleCount = 4;

    const createdTime = new Date(createdAt);
    return steps.slice(0, visibleCount).map((step, i) => ({
      ...step,
      time: step.offset
        ? new Date(createdTime.getTime() + step.offset * 60000).toLocaleTimeString()
        : new Date(createdTime).toLocaleTimeString(),
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-600 text-center mb-6">
        🕒 Live Orders Tracking
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          No active orders for this table.
        </p>
      ) : (
        orders.map((order) => {
          const steps = getSteps(order.status, order.created_at);
          return (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-4 mb-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-gray-800">
                  Order ID: #{order.id}
                </p>
                <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                Table: {order.table_number} | Total: ₹{order.total}
              </p>

              {/* 🧭 Timeline */}
              <ul className="space-y-3 border-l-2 border-emerald-500 pl-4">
                {steps.map((s, idx) => (
                  <li key={idx}>
                    <p className="font-medium text-gray-800">{s.label}</p>
                    <p className="text-sm text-gray-500">{s.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
