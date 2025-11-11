import { useState } from "react";
import Sidebar from "./Sidebar";
import RequestsTab from "./RequestsTab";
import StaffManagement from "./StaffManagement";
import InventoryManagement from "./InventoryManagement";
import CompletedOrderManagement from "./CompletedOrdersManagment";
import MainPage from "./MainPage";
import ProfessionalNavbar from "./components/navbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);

  const tabTitles = {
    dashboard: "Dashboard",
    requests: "Requests",
    inventory: "Inventory Management",
    completed: "Completed Orders",
    staff: "Staff Management",
    reports: "Reports",
    settings: "Settings",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        setPendingCount={setPendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Navbar */}
        <ProfessionalNavbar></ProfessionalNavbar>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === "dashboard" && <MainPage></MainPage>}
          {activeTab === "requests" && (
            <RequestsTab setPendingCount={setPendingCount} />
          )}

          {activeTab === "inventory" && <InventoryManagement />}
          {activeTab === "completed" && <CompletedOrderManagement />}

          {activeTab === "staff" && <StaffManagement />}
          {activeTab === "reports" && (
            <div className="text-gray-800">Reports content here...</div>
          )}
          {activeTab === "settings" && (
            <div className="text-gray-800">Settings page...</div>
          )}
        </div>
      </div>
    </div>
  );
}
