import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import WaiterSidebar from "./WaiterSidebar";
import WaiterOrdersTab from "./WaiterOrdersTab";
import WaiterTablesTab from "./WaiterTablesTab";
import WaiterRequestsTab from "./WaiterRequestsTab";
import WaiterHome from "./WaiterHome";

export default function WaiterDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      {/* Sidebar */}
      <div className="w-72 fixed left-0 top-0 h-screen">
        <WaiterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 overflow-auto p-6">
        {activeTab !== "tables" && (
          <div className="sticky top-0 z-10 bg-[#F9FAFB] mb-6">
            <div className="flex justify-between items-center py-4">
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
          </div>
        )}

        {activeTab === "dashboard" && <WaiterHome />}
        {activeTab === "orders" && <WaiterOrdersTab />}
        {activeTab === "tables" && <WaiterTablesTab />}
        {activeTab === "requests" && <WaiterRequestsTab />}
      </div>
    </div>
  );
}
