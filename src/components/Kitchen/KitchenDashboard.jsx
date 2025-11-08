import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import KitchenSidebar from "./KitchenSidebar";
import StatCard from "./StatCard";
import InventoryDashboard from "./InventoryDashboard";
import CompletedDashboard from "./CompletedDashboard";
import SettingsDashboard from "./SettingsDashboard";
import {
  Clock,
  Package,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import ActiveOrders from "./ActiveOrderstab";

export default function KitchenDashboard() {
  const { logout, accessToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = "http://127.0.0.1:8000/kitchen/orders/";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchOrders = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      else toast.error("Unexpected data format from server.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    total: orders.length,
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <KitchenSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} user={user} />

      <div className="flex-1 ml-72">
        {activeTab === "dashboard" && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Dashboard</h1>
            <p className="text-gray-600 mb-6">Overview of kitchen operations</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon={Clock} label="Pending Orders" value={stats.pending} color="bg-orange-500" />
              <StatCard icon={Package} label="Preparing" value={stats.preparing} color="bg-blue-500" />
              <StatCard icon={CheckCircle} label="Ready to Serve" value={stats.ready} color="bg-green-600" />
              <StatCard icon={TrendingUp} label="Total Today" value={stats.total} color="bg-purple-500" />
            </div>
          </div>
        )}

        {activeTab === "active-orders" && (
          <ActiveOrders orders={orders} accessToken={accessToken} fetchOrders={fetchOrders} logout={logout} />
        )}

        {activeTab === "inventory" && <InventoryDashboard />}
        {activeTab === "completed" && <CompletedDashboard />}
        {activeTab === "settings" && <SettingsDashboard />}
      </div>
    </div>
  );
}
