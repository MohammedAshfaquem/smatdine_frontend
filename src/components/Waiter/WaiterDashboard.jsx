import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import WaiterSidebar from "./WaiterSidebar";
import WaiterOrdersTab from "./WaiterOrdersTab";
import WaiterTablesTab from "./WaiterTablesTab";
import WaiterRequestsTab from "./WaiterRequestsTab";

export default function WaiterDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("orders");

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

        {/* Tabs */}
        {activeTab === "orders" && <WaiterOrdersTab />}
        {activeTab === "tables" && <WaiterTablesTab />}
        {activeTab === "requests" && <WaiterRequestsTab />}
      </div>
    </div>
  );
}
