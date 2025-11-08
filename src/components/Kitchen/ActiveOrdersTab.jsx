import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Clock,
  ChefHat,
  CheckCircle,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

export default function ActiveOrders({
  orders,
  accessToken,
  fetchOrders,
  logout,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timers, setTimers] = useState({});
  const [readyOrders, setReadyOrders] = useState([]);

  // ✅ Fetch ready orders
  useEffect(() => {
    const fetchReadyOrders = async () => {
      if (!accessToken) {
        toast.error("No access token. Please log in again.");
        logout();
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/waiter/orders/ready/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setReadyOrders(data || []);
        } else {
          toast.error("Failed to fetch ready orders");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching ready orders");
      }
    };

    if (statusFilter === "ready") fetchReadyOrders();
  }, [statusFilter, accessToken, logout]);

  // ✅ Initialize timers for all active orders
  useEffect(() => {
    const newTimers = {};
    const currentOrders = statusFilter === "ready" ? readyOrders : orders;

    currentOrders.forEach((order) => {
      if (order.created_at && order.estimated_time) {
        const createdAt = new Date(order.created_at).getTime();
        const estimatedMs = order.estimated_time * 60 * 1000;
        const elapsedMs = Date.now() - createdAt;
        const remaining = Math.max(
          0,
          Math.floor((estimatedMs - elapsedMs) / 1000)
        );
        newTimers[order.id] = remaining;
      }
    });

    setTimers(newTimers);
  }, [orders, readyOrders, statusFilter]);

  // ✅ Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        for (const id in updated) {
          if (updated[id] > 0) updated[id] -= 1;
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Update order status (PATCH)
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!accessToken) {
      toast.error("No access token. Please log in again.");
      logout();
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/kitchen/orders/${orderId}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
        if (statusFilter === "ready") {
          const updated = readyOrders.filter((o) => o.id !== orderId);
          setReadyOrders(updated);
        }
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating order status");
    }
  };

  // ✅ Helper functions
  const getTimeColor = (s) =>
    s > 600 ? "text-green-600" : s > 300 ? "text-orange-500" : "text-red-600";

  const getProgressColor = (s) =>
    s > 600 ? "bg-green-500" : s > 300 ? "bg-orange-500" : "bg-red-500";

  const getTimeDisplay = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const currentOrders = statusFilter === "ready" ? readyOrders : orders;

  // ✅ Filtering
  const filteredOrders = currentOrders.filter((order) => {
    const matchesTab = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      String(order.id).includes(searchQuery) ||
      String(order.table_number || "").includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  // ✅ Realistic Priority Sorting Algorithm
  const prioritizedOrders = filteredOrders.sort((a, b) => {
    const now = Date.now();

    const getRemaining = (order) => {
      const created = new Date(order.created_at).getTime();
      return order.estimated_time * 60 * 1000 - (now - created);
    };

    const statusWeight = {
      ready: 3,
      preparing: 2,
      pending: 1,
    };

    const score = (order) => {
      const remaining = getRemaining(order);
      const weight = statusWeight[order.status] || 0;
      let bonus = 0;

      if (remaining <= 0) bonus += 5; // overdue
      else if (remaining < 5 * 60 * 1000) bonus += 2; // less than 5 min left

      // Urgency factor (less remaining time = higher urgency)
      const urgency = Math.max(0, 3600 * 1000 - remaining) / 1000 / 60;

      return weight * 10 + bonus + urgency;
    };

    return score(b) - score(a); // higher score first
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
        <p className="text-gray-600">Manage and track incoming orders</p>
      </div>

      {/* Search + Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "preparing", label: "Preparing" },
              { id: "ready", label: "Ready" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-5 py-3 rounded-lg font-medium text-sm transition ${
                  statusFilter === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {prioritizedOrders.length > 0 ? (
          prioritizedOrders.map((order) => {
            const remainingSec = timers[order.id] || 0;
            const firstItem = order.items?.[0];
            const imageUrl = (() => {
              if (firstItem?.menu_item?.image) {
                const img = firstItem.menu_item.image;
                return img.startsWith("http")
                  ? img
                  : `http://127.0.0.1:8000${img}`;
              } else if (firstItem?.custom_dish?.image_url) {
                return firstItem.custom_dish.image_url;
              }
              return null;
            })();

            const itemName =
              firstItem?.name ||
              firstItem?.menu_item?.name ||
              firstItem?.custom_dish?.name ||
              "Item";

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-bold text-gray-900">
                        #{order.id}
                      </span>
                      <span
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-orange-50 text-orange-600 border border-orange-200"
                            : order.status === "preparing"
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-green-50 text-green-600 border border-green-200"
                        }`}
                      >
                        {order.status === "pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {order.status === "preparing" && (
                          <ChefHat className="w-3 h-3" />
                        )}
                        {order.status === "ready" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                {/* Table Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      Table {order.table_number}
                    </span>{" "}
                    • {order.items?.length || 0} items
                  </p>
                </div>

                {/* Timer */}
                {order.status !== "ready" && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600 font-medium">
                        Time Remaining
                      </span>
                      <span
                        className={`text-sm font-bold ${getTimeColor(
                          remainingSec
                        )}`}
                      >
                        {getTimeDisplay(remainingSec)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(
                          remainingSec
                        )}`}
                        style={{
                          width: `${Math.max(
                            5,
                            ((order.estimated_time * 60 - remainingSec) /
                              (order.estimated_time * 60)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Item Preview */}
                {firstItem && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ChefHat className="text-emerald-600" size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {itemName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {firstItem.quantity}
                        </p>
                      </div>
                    </div>
                    {order.items.length > 1 && (
                      <p className="text-xs text-emerald-700 font-medium mt-2">
                        +{order.items.length - 1} more items
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Start Preparing
                    </button>
                  )}

                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Ready
                    </button>
                  )}

                  {order.status === "ready" && (
                    <div className="bg-green-50 border-2 border-green-500 text-green-700 py-3 rounded-lg font-semibold text-sm text-center">
                      ✅ Ready to Serve
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <ClipboardList className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Orders will appear here when customers place them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
