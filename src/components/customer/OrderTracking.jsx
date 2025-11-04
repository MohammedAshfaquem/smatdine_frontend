import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check, Clock, ChefHat, Bell, Home, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";
import FeedbackModal from "./FeedbackModal";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Define order statuses and icons
const statusSteps = [
  { key: "pending", label: "Order Received", icon: Clock },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready to Serve", icon: Bell },
  { key: "served", label: "Served", icon: Check },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState(state?.order || null);
  const [progress, setProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // ✅ Fetch order details from backend
  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/`);
      if (!res.ok) throw new Error("Failed to fetch order details");

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order details.");
    }
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Determine progress based on current order status
  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order?.status
  );

  useEffect(() => {
    const targetProgress = ((currentStepIndex + 1) / statusSteps.length) * 100;
    const timer = setTimeout(() => setProgress(targetProgress), 200);
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  // Dynamic color scheme
  const getStatusColor = () => {
    switch (order?.status) {
      case "pending":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "preparing":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "ready":
        return "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "served":
        return "bg-green-50 text-green-800 border-green-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading order details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-emerald-900 font-semibold">Order Tracking</h1>
            <p className="text-sm text-gray-500">Table #{order.table_number}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="border border-emerald-300 text-black-700 px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Menu
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Card */}
        <div
          className={`border ${getStatusColor()} rounded-2xl p-8 text-center mb-6`}
        >
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            {statusSteps[currentStepIndex] &&
              (() => {
                const CurrentIcon = statusSteps[currentStepIndex].icon;
                return <CurrentIcon className="h-10 w-10 text-emerald-600" />;
              })()}
          </div>
          <h2 className="text-xl font-semibold">
            {statusSteps[currentStepIndex]?.label}
          </h2>

          <p className="text-gray-500 mt-2">
            {order.status === "served"
              ? "Your order has been served!"
              : order.time_remaining
              ? `Time remaining: ${order.time_remaining}`
              : `Estimated time: ${order.estimated_time}`}
          </p>

          <div className="mt-3 text-emerald-700 font-semibold">
            Table {order.table_number}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border border-emerald-200 rounded-2xl p-8 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <p
                    className={`text-sm ${
                      isActive ? "text-emerald-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ Order Details */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-emerald-900 mb-4 font-semibold">Order Details</h3>
          <div className="space-y-4">
            {order.items?.map((item, idx) => {
              const isMenuItem = item.type === "menu_item";
              const isCustomDish = item.type === "custom_dish";

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-emerald-100 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {/* ✅ Show actual image for menu items */}
                    {isMenuItem && item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${API_URL}${item.image}`
                        }
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      // ✅ Show "Custom" badge for custom dishes
                      <div className="w-16 h-16 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-300">
                        <span className="text-xs font-semibold text-emerald-700 px-2 py-1 bg-white rounded-md shadow-sm">
                          Custom
                        </span>
                      </div>
                    )}

                    {/* ✅ Item name and details */}
                    <div>
                      <h4 className="text-emerald-900 font-medium">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      {/* ✅ Show ingredients if custom dish */}
                      {isCustomDish && item.ingredients?.length > 0 && (
                        <ul className="mt-1 text-xs text-gray-600 list-disc ml-4">
                          {item.ingredients.map((ing, i) => (
                            <li key={i}>
                              {ing.name} × {ing.quantity}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* ✅ Show preparation time if custom dish */}
                      {isCustomDish && (
                        <p className="text-xs text-emerald-700 mt-1">
                          Prep time: {item.preparation_time} min
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-emerald-700 font-semibold">
                    ₹{parseFloat(item.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="border-t border-emerald-100 mt-4 pt-4 flex justify-between text-emerald-900 font-semibold">
            <span>Total</span>
            <span>₹{parseFloat(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => toast.info("Waiter assistance requested!")}
            className="h-16 border border-emerald-300 rounded-xl hover:bg-emerald-50 flex items-center justify-center gap-2 text-emerald-800 font-medium transition-all duration-300"
          >
            <HelpCircle className="w-5 h-5" />
            Need Assistance?
          </button>

          <button
            onClick={() => setShowFeedback(true)}
            disabled={order.status !== "served"}
            className={`h-16 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${
              order.status === "served"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Bell className="w-5 h-5" />
            Rate Your Experience
          </button>

          <FeedbackModal
            orderId={order.id}
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
          />
        </div>

        {/* Live Updates Section */}
        <div className="mt-8 border border-emerald-200 bg-emerald-50/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-emerald-900 font-semibold">Live Updates</h3>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            {(() => {
              const updates = [];

              const formatTime = (date) =>
                new Date(date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

              const createdAt = new Date(order.created_at);
              const prepStart = new Date(createdAt.getTime() + 5 * 60000);
              const readyAt = new Date(createdAt.getTime() + 25 * 60000);
              const servedAt = new Date(createdAt.getTime() + 30 * 60000);

              if (
                ["pending", "preparing", "ready", "served"].includes(
                  order.status
                )
              )
                updates.push({
                  time: formatTime(createdAt),
                  message: "Order received",
                  color: "text-green-600",
                });
              if (["preparing", "ready", "served"].includes(order.status))
                updates.push({
                  time: formatTime(prepStart),
                  message: "Chef started preparing your order",
                  color: "text-blue-600",
                });
              if (["ready", "served"].includes(order.status))
                updates.push({
                  time: formatTime(readyAt),
                  message: "Your order is ready!",
                  color: "text-orange-600",
                });
              if (order.status === "served")
                updates.push({
                  time: formatTime(servedAt),
                  message: "Order served. Enjoy your meal!",
                  color: "text-green-700",
                });

              return updates.map((u, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className={`text-lg ${u.color}`}>●</span>
                  <span className="font-mono text-gray-600">{u.time}</span>
                  <span>- {u.message}</span>
                </li>
              ));
            })()}
          </ul>
        </div>
      </div>
    </div>
  );
}
