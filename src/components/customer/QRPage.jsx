import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL // from .env file

export default function QRPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Optionally get table number from query or default
  const tableNumber = searchParams.get("table") || 5;

  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  // ✅ Construct dynamic QR image path
  const qrUrl = `${API_URL}/media/qrcodes/qrcodes/table_${tableNumber}_qr.png`;

  const handleScan = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/customer/dashboard?table=${tableNumber}`);
    }, 800); // simulate scan delay
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
      <h1 className="text-3xl font-bold mb-4 text-emerald-700">
        SmartDine Table QR
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center border border-gray-100">
        {!imgError ? (
          <img
            src={qrUrl}
            alt={`QR Code for Table ${tableNumber}`}
            className="w-64 h-64 object-contain border border-gray-200 rounded-lg"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
            QR Not Found
          </div>
        )}

        <p className="mt-3 text-gray-600 text-sm text-center">
          Scan this QR to view your menu and place orders.
        </p>

        <button
          onClick={handleScan}
          disabled={loading}
          className="mt-6 px-6 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
        >
          {loading ? "Scanning..." : `Open Table ${tableNumber}`}
        </button>
      </div>
    </div>
  );
}
