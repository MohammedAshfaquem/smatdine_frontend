import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Droplets, Receipt, Brush } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal.jsx";

export default function AssistancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Dynamically extract tableId from URL (?table=5)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get("table");

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setModalOpen(true);
  };

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 text-[#1F2937]">
      <h2 className="text-2xl font-bold text-[#059669] mb-2">
        🧑‍🍳 Request Assistance
      </h2>
      <p className="text-gray-500 mb-6">
        Select an option below to notify a waiter instantly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Need Water */}
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

        {/* Need Bill */}
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

        {/* Clean Table */}
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
