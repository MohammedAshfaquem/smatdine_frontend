import { useEffect, useState, createContext, useContext } from "react";
import { 
  CheckCircle, 
  Clock,
  Calendar,
  DollarSign,
  Package,
  Download,
  Filter,
  Search,
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3
} from "lucide-react";

// Mock AuthContext for demo
const AuthContext = createContext({ 
  logout: () => console.log("Logout"), 
  accessToken: "demo-token" 
});

// Mock completed orders data
const mockOrders = [
  {
    id: "ORD-101",
    table_number: 5,
    total: 1250.00,
    items: [
      { id: 1, menu_item: { name: "Margherita Pizza" }, quantity: 2 },
      { id: 2, menu_item: { name: "Caesar Salad" }, quantity: 1 },
      { id: 3, menu_item: { name: "Coca Cola" }, quantity: 2 }
    ],
    updated_at: "2024-01-15T14:30:00",
    completed_at: "2024-01-15T14:30:00",
    served_by: "John Doe",
    duration: "35 mins"
  },
  {
    id: "ORD-102",
    table_number: 12,
    total: 890.00,
    items: [
      { id: 4, menu_item: { name: "Chicken Tikka" }, quantity: 1 },
      { id: 5, menu_item: { name: "Garlic Naan" }, quantity: 2 }
    ],
    updated_at: "2024-01-15T14:15:00",
    completed_at: "2024-01-15T14:15:00",
    served_by: "Jane Smith",
    duration: "28 mins"
  },
  {
    id: "ORD-103",
    table_number: 8,
    total: 2150.00,
    items: [
      { id: 6, menu_item: { name: "Grilled Salmon" }, quantity: 2 },
      { id: 7, menu_item: { name: "Wine" }, quantity: 1 },
      { id: 8, menu_item: { name: "Chocolate Cake" }, quantity: 2 }
    ],
    updated_at: "2024-01-15T13:45:00",
    completed_at: "2024-01-15T13:45:00",
    served_by: "John Doe",
    duration: "42 mins"
  },
  {
    id: "ORD-104",
    table_number: 3,
    total: 650.00,
    items: [
      { id: 9, menu_item: { name: "Burger" }, quantity: 1 },
      { id: 10, menu_item: { name: "French Fries" }, quantity: 1 }
    ],
    updated_at: "2024-01-15T13:30:00",
    completed_at: "2024-01-15T13:30:00",
    served_by: "Jane Smith",
    duration: "20 mins"
  }
];

// Stats Card Component
function StatCard({ icon: Icon, label, value, subtext, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
              <Icon className={color} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
          {subtext && (
            <p className="text-xs text-gray-500">{subtext}</p>
          )}
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">#{order.id}</h3>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Completed
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Table {order.table_number}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {order.duration}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">{formatDate(order.completed_at)}</p>
          <p className="text-sm font-semibold text-gray-900">{formatTime(order.completed_at)}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
        <div className="space-y-2">
          {order.items.map((item) => {
            const name = item.menu_item?.name || item.custom_dish?.name || "Unknown Item";
            return (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold text-xs">{item.quantity}</span>
                  </div>
                  <span className="text-gray-900 font-medium">{name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Total Amount</span>
          <span className="text-xl font-bold text-emerald-600">₹{order.total.toFixed(2)}</span>
        </div>
        
        {order.served_by && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <Users className="w-3 h-3" />
            <span>Served by: <span className="font-medium text-gray-700">{order.served_by}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Component
export default function CompletedOrderManagement() {
  const { accessToken, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  const fetchCompletedOrders = async () => {
    if (!accessToken) {
      console.error("No access token. Please log in again.");
      logout();
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/waiter/orders/ready/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      // Use mock data for demo
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table_number.toString().includes(searchQuery);
    return matchesSearch;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading completed orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Orders</h1>
            <p className="text-gray-600">View and manage all completed orders</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download size={18} />
              <span className="font-medium">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
              <BarChart3 size={18} />
              <span className="font-medium">Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          subtext="Completed today"
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          subtext="Today's earnings"
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={`₹${avgOrderValue.toFixed(2)}`}
          subtext="Per order average"
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={Package}
          label="Items Sold"
          value={totalItems}
          subtext="Total items today"
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or table number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="mx-auto text-emerald-600 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "No orders found" : "No completed orders yet"}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? "Try adjusting your search query" 
              : "Once orders are marked completed, they will appear here."}
          </p>
        </div>
      ) : (
        <>
          {/* Summary Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> completed orders
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-sm text-gray-600">
                Total Revenue: <span className="font-semibold text-emerald-600">₹{totalRevenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{dateFilter === "today" ? "Today" : dateFilter}</span>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrders.map((order) => (
              <CompletedOrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}