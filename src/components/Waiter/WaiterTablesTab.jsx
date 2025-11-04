import { useEffect, useState } from "react";
import api from "../../api/staff";
import { toast } from "react-toastify";

export default function WaiterTablesTab() {
  const [tables, setTables] = useState([]);

  const fetchTables = async () => {
    try {
      const res = await api.get("api/tables/");
      setTables(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tables");
    }
  };

  useEffect(() => {
    fetchTables();
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
    <div>
      <h2 className="text-xl font-medium mb-4">🪑 Tables Overview</h2>
      {tables.length === 0 ? (
        <p className="text-gray-500 text-center">No tables found.</p>
      ) : (
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
      )}
    </div>
  );
}
