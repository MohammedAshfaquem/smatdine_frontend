import { useEffect, useState } from "react";
import api from "../../api/staff"; // ✅ use your working axios instance

export default function TablesTab() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/tables/"); // ✅ token automatically included
      setTables(res.data);
    } catch (err) {
      console.error("❌ Error fetching tables:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 border-red-400 text-red-700";
      case "reserved":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      default:
        return "bg-green-100 border-green-400 text-green-700";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "occupied":
        return "bg-red-500 text-white";
      case "reserved":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        🪑 Table Overview
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading tables...</p>
      ) : tables.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`p-5 rounded-2xl shadow-sm border ${getStatusColor(
                table.status
              )} transition hover:shadow-md hover:scale-[1.02] cursor-pointer`}
            >
              <div className="text-lg font-semibold">
                Table {table.table_number}
              </div>
              <div className="text-sm">Seats: {table.seats}</div>
              <div
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                  table.status
                )}`}
              >
                {table.status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No tables found.</p>
      )}
    </div>
  );
}
