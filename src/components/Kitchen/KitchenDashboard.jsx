import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Clock, Package, CheckCircle, Boxes } from "lucide-react";

export default function KitchenDashboard() {
  const { logout, accessToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const API_URL = "http://127.0.0.1:8000/kitchen/orders/";

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/kitchen/orders/${orderId}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Error updating order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered data
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  if (loading) return <div className="p-6 text-gray-500">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-emerald-600 text-white px-8 py-4 shadow-md">
        <div>
          <h1 className="text-xl font-semibold">Kitchen Dashboard</h1>
          <p className="text-sm text-emerald-100">Manage incoming orders</p>
        </div>
        <button
          onClick={logout}
          className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-100 transition"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-6 px-8 py-4">
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <Clock className="text-orange-500" />
          <div>
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <h3 className="text-lg font-semibold">{pendingOrders.length}</h3>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <Package className="text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Preparing</p>
            <h3 className="text-lg font-semibold">{preparingOrders.length}</h3>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Ready</p>
            <h3 className="text-lg font-semibold">{readyOrders.length}</h3>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <Boxes className="text-yellow-500" />
          <div>
            <p className="text-gray-500 text-sm">Stock Items</p>
            <h3 className="text-lg font-semibold">24</h3> {/* temp hardcoded */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-start gap-4 px-8 mt-2 mb-4 border-b border-gray-200">
        {[
          { id: "all", label: "All Orders" },
          { id: "pending", label: "Pending" },
          { id: "preparing", label: "Preparing" },
          { id: "ready", label: "Ready" },
          { id: "stock", label: "Stock" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-3 font-medium text-sm transition border-b-2 ${
              activeTab === tab.id
                ? "text-emerald-700 border-emerald-500"
                : "text-gray-500 border-transparent hover:text-emerald-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Section */}
      <div className="px-8 py-4">
        {activeTab !== "stock" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl shadow-md border-t-4 ${
                    order.status === "pending"
                      ? "border-orange-500"
                      : order.status === "preparing"
                      ? "border-blue-500"
                      : "border-green-500"
                  } p-5`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">
                        Table {order.table_number}
                      </h3>
                      <p className="text-sm text-gray-500">Order #{order.id}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      ⏱ {order.estimated_time} min
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.menu_item_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status === "ready" && (
                    <div className="text-center text-green-700 font-semibold py-2">
                      ✅ Ready to Serve
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                No orders found.
              </div>
            )}
          </div>
        ) : (
          // STOCK TAB
          <div className="bg-white shadow rounded-xl p-6 text-center text-gray-600">
            <h3 className="text-lg font-semibold text-emerald-700 mb-3">
              Stock Management
            </h3>
            <p>Stock data integration coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
