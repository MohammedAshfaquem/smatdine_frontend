import React from "react";

export default function CompletedDashboard({ completedOrders }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Completed Orders</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {completedOrders.length > 0 ? (
          <div>
            {completedOrders.map((order) => (
              <div key={order.id} className="mb-4 p-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Table {order.table_number}</span>
                  <span className="text-green-600 font-semibold">Served</span>
                </div>
                <p className="text-gray-600">Total: ${order.total}</p>
                <p className="text-gray-600">Time: {new Date(order.created_at).toLocaleTimeString()}</p>
                <div className="mt-2">
                  <h3 className="font-semibold">Items:</h3>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id} className="text-gray-600">
                        {item.menu_item.name} x {item.quantity} - ${item.subtotal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No completed orders today.</p>
        )}
      </div>
    </div>
  );
}
