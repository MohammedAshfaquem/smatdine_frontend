import { useState } from "react";
import { useLocation } from "react-router-dom";
import SmartDineSidebar from "./SideBar.jsx";
import RestaurantMenu from "./RestaurantMenu.jsx";
import LiveOrders from "./LiveOrders.jsx"; // 👈 import here

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("menu");
  const location = useLocation();

  // Get tableId from URL ?table=5
  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get("table");

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-72 h-screen sticky top-0">
        <SmartDineSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto h-screen p-6">
        {activeTab === "menu" && <RestaurantMenu tableId={tableId} />}
        {activeTab === "orders" && <LiveOrders tableId={tableId} />} {/* 👈 replaced */}
        {activeTab === "custom" && (
          <div>
            <h1 className="text-2xl font-semibold mb-4">⚙️ Custom Dishes</h1>
            <p>Create your own custom combinations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
