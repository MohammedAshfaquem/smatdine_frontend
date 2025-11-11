import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

export default function CompletedDashboard({ completedOrders }) {
  const BASE_URL = "http://127.0.0.1:8000"; // adjust if backend served elsewhere

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Completed Orders</h1>

      <div className="space-y-4">
        {completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Table {order.table_number}
                    </h3>
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      Served
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{parseFloat(order.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Order Items
                </h4>
                <div className="grid gap-4">
                  {order.items.map((item) => {
                    const imgSrc = item.menu_item.image
                      ? `${BASE_URL}${item.menu_item.image}`
                      : "https://via.placeholder.com/80x80?text=No+Image";

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        {/* Item Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={imgSrc}
                            alt={item.menu_item.name}
                            className="w-20 h-20 object-cover rounded-lg shadow"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {item.menu_item.name}
                          </h5>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="bg-white px-2 py-1 rounded border border-gray-200">
                              Qty:{" "}
                              <span className="font-medium text-gray-900">
                                {item.quantity}
                              </span>
                            </span>
                            <span>×</span>
                            <span>₹{parseFloat(item.menu_item.price).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{parseFloat(item.subtotal).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 font-medium">
              No completed orders today
            </p>
            <p className="text-gray-500 mt-2">
              Completed orders will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
