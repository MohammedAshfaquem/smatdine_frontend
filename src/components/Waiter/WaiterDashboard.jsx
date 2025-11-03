import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import WaiterSidebar from "./WaiterSidebar";
import api from "../../api/staff"; // ✅ use token-auth axios instance
import { toast } from "react-toastify";

export default function WaiterDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Ready Orders
  const fetchReadyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("waiter/orders/ready/"); // ✅ token auto included
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch ready orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark Order as Served
  const markAsServed = async (orderId) => {
    try {
      await api.patch(`waiter/orders/${orderId}/served/`); // ✅ token auto included
      toast.success(`Order ${orderId} marked as served`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  // ✅ Fetch All Tables
  const fetchTables = async () => {
    try {
      const res = await api.get("api/tables/"); // ✅ token auto included
      setTables(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tables");
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchReadyOrders();
      const interval = setInterval(fetchReadyOrders, 10000);
      return () => clearInterval(interval);
    }
    if (activeTab === "tables") {
      fetchTables();
    }
  }, [activeTab]);

  // ✅ Table status color helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 border-red-400 text-red-700";
      case "reserved":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      default:
        return "bg-green-100 border-green-400 text-green-700";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "occupied":
        return "bg-red-500 text-white";
      case "reserved":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      {/* Sidebar */}
      <WaiterSidebar
        waiter={{ name: user?.name, role: user?.role }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome, {user?.name || "Waiter"} 👋
          </h1>
          <button
            onClick={logout}
            className="bg-[#059669] text-white px-4 py-2 rounded-lg hover:bg-[#047857] transition"
          >
            Logout
          </button>
        </div>

        {/* --- ORDERS TAB --- */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-medium mb-4">🍽️ Ready to Serve Orders</h2>

            {loading ? (
              <p className="text-gray-500 text-center">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-center">
                No ready orders at the moment.
              </p>
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
        )}

        {/* --- TABLES TAB --- */}
        {activeTab === "tables" && (
          <div>
            <h2 className="text-xl font-medium mb-4">🪑 Tables Overview</h2>

            {tables.length === 0 ? (
              <p className="text-gray-500 text-center">No tables found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`p-5 rounded-2xl shadow-sm border ${getStatusColor(
                      table.status
                    )} transition hover:shadow-md hover:scale-[1.02] cursor-pointer`}
                  >
                    <div className="text-lg font-semibold">
                      Table {table.table_number}
                    </div>
                    <div className="text-sm">Seats: {table.seats}</div>
                    <div
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- ASSISTANCE TAB --- */}
        {activeTab === "assistance" && (
          <div>
            <h2 className="text-xl font-medium mb-2">Assistance Requests</h2>
            <p className="text-gray-600">
              Track and respond to customer assistance requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
