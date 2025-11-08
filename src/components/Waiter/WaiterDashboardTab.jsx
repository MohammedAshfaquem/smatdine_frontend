import React from "react";

export default function WaiterDashboardTab({ user }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Welcome, {user?.name || "Waiter"} 👋
      </h1>
      <p className="text-gray-600 text-lg">
        Ready for another great day of service!
      </p>
    </div>
  );
}
