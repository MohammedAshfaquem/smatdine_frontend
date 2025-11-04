import { useState } from "react";
import { useLocation } from "react-router-dom";
import SmartDineSidebar from "./SideBar.jsx";
import RestaurantMenu from "./RestaurantMenu.jsx";
import LiveOrders from "./LiveOrders.jsx";
import AssistancePage from "./AssistancePage.jsx"; // ✅ new import
import CustomDishes from "./CustomDishes.jsx";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("menu");
  const location = useLocation();

  // ✅ Extract tableId from URL ?table=5
  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get("table");

  return (
    <div className="flex bg-gray-500 min-h-screen">
  {/* Sidebar */}
  <div className="w-72 h-screen sticky top-0">
    <SmartDineSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>

  {/* Main Content Area */}
  <div className="flex-1 overflow-y-auto h-screen">
    {activeTab === "menu" && <RestaurantMenu tableId={tableId} />}
    {activeTab === "orders" && <LiveOrders tableId={tableId} />}
    {activeTab === "custom" && <CustomDishes />}
    {activeTab === "assistance" && <AssistancePage tableId={tableId} />}
  </div>
</div>

  );
}
