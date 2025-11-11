import React from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle, 
  Archive, 
  Settings, 
  LogOut 
} from "lucide-react";

function KitchenSidebar({ activeTab, setActiveTab, onLogout, user }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "active-orders", label: "Active Orders", icon: ClipboardList },
    { id: "completed", label: "Completed", icon: CheckCircle },
    { id: "inventory", label: "Inventory", icon: Archive },
  ];

  return (
    <div className="w-72 bg-[#065F46] text-white flex flex-col shadow-xl fixed left-0 top-0 h-screen z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-800 bg-[#047857]">
        <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white text-lg font-bold shadow-md">
          👨‍🍳
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">SmartDine</h1>
          <p className="text-xs text-emerald-200">Kitchen System</p>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-emerald-800 bg-[#047857]/70">
        <div className="w-10 h-10 rounded-full bg-emerald-900 text-[#FACC15] flex items-center justify-center font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || "C"}
        </div>
        <div>
          <h2 className="font-medium text-white">{user?.name || "Chef Kumar"}</h2>
          <span className="text-xs bg-[#FACC15]/20 text-[#FACC15] px-2 py-0.5 rounded-full font-medium">
            Kitchen
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-3 px-2 overflow-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium transition rounded-lg my-1 ${
                isActive
                  ? "bg-[#059669] text-white font-semibold"
                  : "text-emerald-100 hover:bg-emerald-700/50 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#FACC15] rounded-r"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="px-2 pb-2">
        {/* <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-emerald-100 hover:bg-emerald-700/50 hover:text-white transition rounded-lg">
          <Settings size={18} />
          Settings
        </button> */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-emerald-100 hover:bg-red-600/80 hover:text-white transition rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-emerald-800 bg-[#047857]/70 text-center text-xs text-emerald-200">
        <span className="font-medium text-white">SmartDine Kitchen</span> v1.0
      </div>
    </div>
  );
}

export default KitchenSidebar;
