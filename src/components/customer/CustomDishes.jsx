import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Star, Sparkles, ChefHat } from "lucide-react";

export default function CustomDishes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();
  const { tableId } = useParams();
  const location = useLocation();

  // ✅ Extract table number from query string if available
  const queryParams = new URLSearchParams(location.search);
  const tableFromQuery = queryParams.get("table");

  // ✅ Determine active table ID (from param, query, or localStorage)
  const activeTableId =
    tableFromQuery ||
    tableId ||
    location.state?.tableId ||
    localStorage.getItem("tableId") ||
    1;

  // ✅ Save tableId in localStorage (so Step1, Step2, Step3 can use it)
  useEffect(() => {
    if (activeTableId) {
      localStorage.setItem("tableId", activeTableId);
    }
  }, [activeTableId]);

  const popularCreations = [
    {
      id: 1,
      name: "Berry Blast Smoothie",
      image:
        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop",
      base: "Yogurt",
      itemCount: 4,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Green Energy Juice",
      image:
        "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop",
      base: "Water",
      itemCount: 4,
      isFavorite: true,
    },
    {
      id: 3,
      name: "Tropical Paradise Shake",
      image:
        "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
      base: "Coconut Milk",
      itemCount: 3,
      isFavorite: true,
    },
  ];

  // ✅ When user clicks start, go to Step1 with correct tableId
  const handleStartCreating = () => {
    navigate(`/step1/${activeTableId}`, { state: { tableId: activeTableId } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat size={32} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">Custom Dishes</h1>
                <Sparkles size={24} className="text-yellow-300" />
              </div>
              <p className="text-emerald-50 text-base">
                Create unique beverages and treats tailored to your taste
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Create New Custom Dish Section */}
        <div className="border-2 border-dashed border-emerald-300 rounded-3xl p-8 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Plus size={48} className="text-white" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                  Create New Custom Dish
                </h2>
                <p className="text-gray-700 text-base mb-4">
                  Build your perfect juice, smoothie, shake, or dessert from scratch
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg">
                    20+ ingredients
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                    6 base options
                  </span>
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg">
                    Unlimited combinations
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleStartCreating}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg transition-all duration-300 flex-shrink-0"
            >
              <Sparkles size={20} />
              <span>Start Creating</span>
            </button>
          </div>
        </div>

        {/* Popular Custom Creations */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Star size={28} className="text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Popular Custom Creations
            </h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-lg">
              Most Loved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCreations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="relative h-56">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <p className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                    Customer Favorite
                  </p>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-emerald-800 mb-3">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg">
                      Base: {item.base}
                    </span>
                    <span className="text-gray-600 text-sm font-medium">
                      {item.itemCount} items
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Saved Recipes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Saved Recipes</h2>

          {savedRecipes.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 bg-white text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ChefHat size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No Saved Recipes Yet
                </h3>
                <p className="text-gray-600 text-base mb-6">
                  Create your first custom dish and save it for quick reordering
                </p>
                <button
                  onClick={handleStartCreating}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300"
                >
                  <Plus size={20} />
                  <span>Create Your First Recipe</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Saved recipes appear here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
