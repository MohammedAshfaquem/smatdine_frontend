import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Droplets, Receipt, Brush } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function AssistancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  // ✅ Extract table number from URL (?table=5)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get("table");

  // ✅ Handle button click
  const handleActionClick = (action) => {
    setSelectedAction(action);
    setModalOpen(true);
  };

  // ✅ Confirm & send waiter request
  const handleConfirm = async () => {
    if (!selectedAction || !tableId) {
      toast.error("Table ID missing!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/waiter-request/${tableId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type:
              selectedAction === "Need Water"
                ? "need water"
                : selectedAction === "Need Bill"
                ? "need bill"
                : "clean table",
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchRequests();
      } else {
        toast.error(data.error || "Request failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setModalOpen(false);
      setLoading(false);
    }
  };

  // ✅ Fetch all requests for this table
  const fetchRequests = async () => {
    if (!tableId) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/waiter/requests/${tableId}/`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your requests");
    }
  };

  useEffect(() => {
    if (tableId) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 7000);
      return () => clearInterval(interval);
    }
  }, [tableId]);

  // ✅ Badge style for status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 text-[#1F2937]">
      <h2 className="text-2xl font-bold text-[#059669] mb-2">
        🧑‍🍳 Request Assistance
      </h2>
      <p className="text-gray-500 mb-6">
        Select an option below to notify a waiter instantly.
      </p>

      {/* --- Action Buttons --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => handleActionClick("Need Water")}
          className="bg-white border border-[#059669]/30 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center justify-center"
        >
          <Droplets className="text-[#059669] mb-3" size={36} />
          <h3 className="font-semibold text-lg text-[#059669] mb-1">
            Need Water
          </h3>
          <p className="text-sm text-gray-500">Request drinking water</p>
        </button>

        <button
          onClick={() => handleActionClick("Need Bill")}
          className="bg-white border border-[#059669]/30 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center justify-center"
        >
          <Receipt className="text-[#059669] mb-3" size={36} />
          <h3 className="font-semibold text-lg text-[#059669] mb-1">
            Need Bill
          </h3>
          <p className="text-sm text-gray-500">Request your final bill</p>
        </button>

        <button
          onClick={() => handleActionClick("Clean Table")}
          className="bg-white border border-[#059669]/30 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center justify-center"
        >
          <Brush className="text-[#059669] mb-3" size={36} />
          <h3 className="font-semibold text-lg text-[#059669] mb-1">
            Clean Table
          </h3>
          <p className="text-sm text-gray-500">Ask staff to clean the table</p>
        </button>
      </div>

      {/* --- User's Assistance Requests --- */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#059669]">
          📋 Your Assistance Requests
        </h3>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven’t made any requests yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-[#059669] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Requested At</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 capitalize">{req.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(req.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Assistance"
        message={`Do you want to request "${selectedAction}"?`}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
        confirmText={loading ? "Requesting..." : "Yes, Request"}
        cancelText="Cancel"
        type="approve"
      />
    </div>
  );
}
