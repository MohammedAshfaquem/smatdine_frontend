import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import WaiterSidebar from "./WaiterSidebar";
import WaiterOrdersTab from "./WaiterOrdersTab";
import WaiterTablesTab from "./WaiterTablesTab";
import WaiterRequestsTab from "./WaiterRequestsTab";

export default function WaiterDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");

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
        {/* ✅ Show Welcome Header on dashboard, orders, and requests */}
        {activeTab !== "tables" && (
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
        )}

        {/* ✅ Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold text-[#059669]">
              🍽️ Welcome to SmartDine Dashboard
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your tables, orders, and requests efficiently.
            </p>
          </div>
        )}

        {/* ✅ Orders Tab */}
        {activeTab === "orders" && <WaiterOrdersTab />}

        {/* 🚫 Tables Tab — hides welcome header */}
        {activeTab === "tables" && <WaiterTablesTab />}

        {/* ✅ Requests Tab */}
        {activeTab === "requests" && <WaiterRequestsTab />}
      </div>
    </div>
  );
}
