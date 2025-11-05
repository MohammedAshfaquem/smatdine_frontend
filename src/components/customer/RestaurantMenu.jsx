import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuHeader from "./Menu/MenuHeader";
import SearchBar from "./Menu/SearchBar";
import Filters from "./Menu/Filters";
import CategoryTabs from "./Menu/CategoryTabs";
import CustomDishSection from "./Menu/CustomDishSection";
import MenuGrid from "./Menu/MenuGrid";
import CartSidebar from "./Menu/CartSidebar";
import ItemModal from "./Menu/ItemModal";

export default function RestaurantMenu() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableNumber = parseInt(queryParams.get("table"), 10);

  const [menuItems, setMenuItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpice, setSelectedSpice] = useState("All Spice");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const BASE_URL = "http://127.0.0.1:8000";

  // 🟢 Fetch menu items
  const fetchMenuItems = async (filterType = "All", category = "All") => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/menu/`;
      const params = [];
      if (filterType === "Veg") params.push("type=veg");
      else if (filterType === "Non-Veg") params.push("type=non-veg");
      if (category !== "All") params.push(`category=${category}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const res = await axios.get(url);
      setMenuItems(res.data);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch cart count from backend
  const fetchCartCount = async () => {
    if (!tableNumber) return;
    try {
      const res = await axios.get(`${BASE_URL}/cart/count/${tableNumber}/`);
      setCartCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchMenuItems(selectedFilter, selectedCategory);
  }, [selectedFilter, selectedCategory]);

  useEffect(() => {
    if (tableNumber) {
      fetchCartCount();
    }
  }, [tableNumber]);

  // 🟢 Add to Cart
  const handleAddToCart = async (item, quantity, specialInstructions) => {
    if (!tableNumber) {
      toast.error("No table found. Please scan QR again.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/cart/add/`, {
        table_number: tableNumber,
        menu_item_id: item.id,
        quantity,
        special_instructions: specialInstructions || "",
      });
      toast.success(response.data.message);

      // Refresh cart count from backend instead of manual increment
      fetchCartCount();
    } catch {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative overflow-hidden">
      <div className={`transition-all duration-300 ${showCart ? "pr-96" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <MenuHeader
            tableNumber={tableNumber}
            cartCount={cartCount}
            onCartClick={() => setShowCart(true)}
          />

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <Filters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSpice={selectedSpice}
            setSelectedSpice={setSelectedSpice}
          />

          <CategoryTabs
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* <CustomDishSection /> */}

          <MenuGrid
            loading={loading}
            menuItems={menuItems}
            searchQuery={searchQuery}
            selectedSpice={selectedSpice}
            onSelectItem={setSelectedItem}
            BASE_URL={BASE_URL}
          />
        </div>
      </div>

      <CartSidebar
        showCart={showCart}
        setShowCart={setShowCart}
        tableId={tableNumber}
        
        onCartChange={fetchCartCount} 
        
      />

      {selectedItem && (
  <ItemModal
    item={selectedItem}
    tableNumber={tableNumber}   // ✅ add this line
    onClose={() => setSelectedItem(null)}
    onAddToCart={handleAddToCart}
  />
)}

    </div>
  );
}
