import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Table2,
  UtensilsCrossed,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react"; 

export default function WaiterSidebar({ activeTab, setActiveTab }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "tables", label: "Tables", icon: Table2 },
    { id: "requests", label: "Requests", icon: Bell }, 
    // { id: "reports", label: "Reports", icon: BarChart3 },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-72 bg-[#065F46] text-white min-h-screen flex flex-col shadow-xl">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-800 bg-[#047857]">
        <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white text-lg font-bold shadow-md">
          🍽️
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">SmartDine</h1>
          <p className="text-xs text-emerald-200">POS System</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-b border-emerald-800 bg-[#047857]/70">
        <div className="w-10 h-10 rounded-full bg-emerald-900 text-[#FACC15] flex items-center justify-center font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="font-medium text-white">{user?.name || "Waiter"}</h2>
          <span className="text-xs bg-[#FACC15]/20 text-[#FACC15] px-2 py-0.5 rounded-full font-medium capitalize">
            {user?.role || "staff"}
          </span>
        </div>
      </div>

      <nav className="flex-1 mt-3 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium transition rounded-lg my-1 group
                ${
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

      <div className="px-6 py-4 border-t border-emerald-800 bg-[#047857]/70 text-center text-xs text-emerald-200">
        <span className="font-medium text-white">SmartDine POS</span> v1.0
      </div>
    </div>
  );
}
