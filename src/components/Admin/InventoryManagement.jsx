import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Package, CheckCircle, AlertTriangle, BarChart3, Download, Plus, Archive } from "lucide-react";
import StatCard from "./components/InventoryStatCard";
import InventoryStatCard from "./components/InventoryStatCard";
import InventoryFilters from "./components/InventoryFilters";
import InventoryCard from "./components/InventoryCard";


export default function InventoryManagement() {
  const { accessToken, logout } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");

  const fetchMenuItems = async () => {
    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      logout();
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/menu/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenuItems(); }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStock = filterStock === "all" || (filterStock === "low" && item.is_low_stock) || (filterStock === "normal" && !item.is_low_stock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalItems = menuItems.length;
  const lowStockItems = menuItems.filter(item => item.is_low_stock).length;
  const inStockItems = menuItems.filter(item => !item.is_low_stock).length;
  const totalValue = menuItems.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const categories = ["all", ...new Set(menuItems.map(item => item.category))];

  const handleEdit = (item) => console.log("Edit item:", item);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading inventory...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your restaurant inventory</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download size={18} />
            <span className="font-medium">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
            <Plus size={18} />
            <span className="font-medium">Add Item</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InventoryStatCard icon={Package} label="Total Items" value={totalItems} change="+5.2%" color="text-blue-600" bgColor="bg-blue-50" />
        <InventoryStatCard icon={CheckCircle} label="In Stock" value={inStockItems} change="+2.4%" color="text-green-600" bgColor="bg-green-50" />
        <InventoryStatCard icon={AlertTriangle} label="Low Stock" value={lowStockItems} change="-1.2%" color="text-red-600" bgColor="bg-red-50" />
        <InventoryStatCard icon={BarChart3} label="Total Value" value={`₹${totalValue.toLocaleString()}`} change="+8.3%" color="text-purple-600" bgColor="bg-purple-50" />
      </div>

      {/* Filters */}
      <InventoryFilters
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        filterStock={filterStock} setFilterStock={setFilterStock}
        categories={categories}
      />

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? filteredItems.map(item => <InventoryCard key={item.id} item={item} onEdit={handleEdit} />) : (
          <div className="col-span-full text-center py-12">
            <Archive className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterCategory !== "all" || filterStock !== "all" 
                ? "Try adjusting your filters"
                : "Add your first inventory item to get started"}
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
              <Plus size={18} />
              Add Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
