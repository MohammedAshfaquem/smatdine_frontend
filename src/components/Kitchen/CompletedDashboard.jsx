import { useEffect, useState, createContext, useContext } from "react";
import { CheckCircle, Clock, Users, Package, Search } from "lucide-react";

// Mock AuthContext
const AuthContext = createContext({ 
  logout: () => console.log("Logout"), 
  accessToken: "demo-token" 
});

// Stats Card Component
function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={color} size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );
}

// Order Card Component
function CompletedOrderCard({ order }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">#{order.id}</h3>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "ready" ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
              <CheckCircle className="w-3 h-3" />
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Table {order.table_number}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {order.time_remaining || "N/A"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">{order.created_at.split(" ")[0]}</p>
          <p className="text-sm font-semibold text-gray-900">{formatTime(order.created_at)}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-xs">{item.quantity}</span>
              </div>
              <span className="text-gray-900 font-medium">{item.menu_item?.name || item.name || "Unknown Item"}</span>
            </div>
            <span className="text-gray-700 text-xs">₹{item.subtotal}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Total Amount</span>
        <span className="text-xl font-bold text-emerald-600">₹{order.total}</span>
      </div>
    </div>
  );
}

// Main Component
export default function CompletedOrdersKitchen({ tableId }) {
  const { accessToken, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    if (!accessToken) return logout();
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/orders/${tableId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Filter today's orders
  const todaysOrders = orders.filter(order => order.created_at.startsWith(today));
  const servedOrdersCount = todaysOrders.filter(order => order.status === "ready").length;

  // Filtered by search
  const filteredOrders = todaysOrders.filter(order =>
    order.id.toString().includes(searchQuery) ||
    order.table_number.toString().includes(searchQuery)
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Table {tableId} Orders</h1>
      <p className="text-gray-600 mb-6">
        Total Orders Today: <span className="font-semibold">{todaysOrders.length}</span> | 
        Served Orders: <span className="font-semibold text-green-600">{servedOrdersCount}</span>
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard icon={Package} label="Total Orders Today" value={todaysOrders.length} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard icon={Package} label="Served Orders" value={servedOrdersCount} color="text-green-600" bgColor="bg-green-50" />
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by order ID or table..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto text-emerald-600 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found for today</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => <CompletedOrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}
