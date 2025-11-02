import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderTracking() {
  const { state } = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState(state?.order || null);
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    if (!order) return;

    // Mock timestamps for demo
    const now = new Date();
    const times = [
      { status: "Order received", offset: 0 },
      { status: "Chef started preparing your order", offset: -3 },
      { status: "Your order is ready!", offset: -5 },
      { status: "Order served. Enjoy your meal!", offset: -7 },
    ];

    const history = times.map((s) => ({
      ...s,
      time: new Date(now.getTime() + s.offset * 60000).toLocaleTimeString(),
    }));

    setStatusHistory(history);
  }, [order]);

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading order details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-2xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-emerald-600 text-center mb-6">
          Order Tracking
        </h2>

        <div className="mb-6 text-center">
          <p className="text-gray-700 font-semibold">
            Order ID: #{orderId}
          </p>
          <p className="text-gray-600">
            Table: {order.table_number} | Status:{" "}
            <span className="font-semibold text-emerald-600">
              {order.status}
            </span>
          </p>
        </div>

        <ul className="space-y-4">
          {statusHistory.map((s, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-3 h-3 mt-1.5 bg-emerald-500 rounded-full" />
              <div>
                <p className="font-medium text-gray-800">{s.status}</p>
                <p className="text-sm text-gray-500">{s.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
