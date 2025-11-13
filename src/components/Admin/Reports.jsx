import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Trophy, TrendingUp, Clock, CheckCircle, Flame, Award, Medal, Crown, Star, Calendar, ChefHat, Users } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffLeaderboard() {
  const { accessToken } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("kitchen");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("today");

  // Sample data for Kitchen Staff
  const kitchenSampleData = [
    {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      ordersCompleted: 156,
      avgTime: "8.5 min",
      accuracy: 98.5,
      rating: 4.9,
      badges: ["🔥", "⚡", "👨‍🍳"]
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "SS",
      ordersCompleted: 142,
      avgTime: "9.2 min",
      accuracy: 97.8,
      rating: 4.8,
      badges: ["⚡", "👨‍🍳"]
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "MJ",
      ordersCompleted: 138,
      avgTime: "9.8 min",
      accuracy: 96.5,
      rating: 4.7,
      badges: ["👨‍🍳"]
    },
    {
      id: 4,
      name: "Emily Davis",
      avatar: "ED",
      ordersCompleted: 125,
      avgTime: "10.2 min",
      accuracy: 95.2,
      rating: 4.6,
      badges: ["⚡"]
    },
    {
      id: 5,
      name: "David Wilson",
      avatar: "DW",
      ordersCompleted: 118,
      avgTime: "10.8 min",
      accuracy: 94.8,
      rating: 4.5,
      badges: ["👨‍🍳"]
    },
  ];

  // Sample data for Waiters
  const waiterSampleData = [
    {
      id: 1,
      name: "Alice Cooper",
      avatar: "AC",
      ordersServed: 245,
      avgServiceTime: "3.2 min",
      customerRating: 4.9,
      tips: 1250,
      badges: ["💰", "⭐", "🏆"]
    },
    {
      id: 2,
      name: "Bob Martin",
      avatar: "BM",
      ordersServed: 228,
      avgServiceTime: "3.8 min",
      customerRating: 4.7,
      tips: 1120,
      badges: ["⭐", "🏆"]
    },
    {
      id: 3,
      name: "Carol White",
      avatar: "CW",
      ordersServed: 215,
      avgServiceTime: "4.1 min",
      customerRating: 4.6,
      tips: 980,
      badges: ["⭐"]
    },
    {
      id: 4,
      name: "Daniel Lee",
      avatar: "DL",
      ordersServed: 198,
      avgServiceTime: "4.5 min",
      customerRating: 4.5,
      tips: 890,
      badges: ["💰"]
    },
    {
      id: 5,
      name: "Emma Garcia",
      avatar: "EG",
      ordersServed: 185,
      avgServiceTime: "4.8 min",
      customerRating: 4.4,
      tips: 825,
      badges: []
    },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter, activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Replace with actual API endpoint
      // const res = await fetch(`${API_URL}/api/${activeTab}/leaderboard/?period=${timeFilter}`, {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      // const data = await res.json();
      
      // Use sample data based on active tab
      setTimeout(() => {
        setLeaderboardData(activeTab === "kitchen" ? kitchenSampleData : waiterSampleData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-300" };
    if (index === 1) return { icon: Medal, color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-300" };
    if (index === 2) return { icon: Medal, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300" };
    return null;
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      "from-yellow-400 to-orange-500",
      "from-gray-400 to-gray-600",
      "from-orange-400 to-orange-600",
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
    ];
    return gradients[index] || "from-gray-400 to-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const topPerformer = leaderboardData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Staff Leaderboard
            </h1>
            <p className="text-gray-600 mt-1">Track and celebrate top performers</p>
          </div>
          
          {/* Time Filter */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            {["today", "week", "month", "all"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === filter
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("kitchen")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "kitchen"
                ? "bg-white text-green-600 shadow-md border-2 border-green-600"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <ChefHat className="w-5 h-5" />
            Kitchen Staff
          </button>
          <button
            onClick={() => setActiveTab("waiter")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "waiter"
                ? "bg-white text-blue-600 shadow-md border-2 border-blue-600"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Users className="w-5 h-5" />
            Waiters
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* 2nd Place */}
          {leaderboardData[1] && (
            <div className="flex flex-col items-center pt-12">
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${getAvatarGradient(1)} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-gray-300`}>
                  {leaderboardData[1].avatar}
                </div>
                <div className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 text-center">{leaderboardData[1].name}</h3>
              <p className="text-sm text-gray-600">
                {activeTab === "kitchen" 
                  ? `${leaderboardData[1].ordersCompleted} orders` 
                  : `${leaderboardData[1].ordersServed} served`}
              </p>
              <div className="mt-4 bg-gradient-to-t from-gray-400 to-gray-500 text-white px-6 py-8 rounded-t-xl w-full text-center shadow-lg">
                <Medal className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {activeTab === "kitchen" ? leaderboardData[1].rating : leaderboardData[1].customerRating}
                </p>
                <p className="text-xs opacity-90">Rating</p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {leaderboardData[0] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarGradient(0)} rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-yellow-400`}>
                  {leaderboardData[0].avatar}
                </div>
                <div className="absolute -top-3 -right-3 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
                <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="mt-3 font-bold text-gray-900 text-lg text-center">{leaderboardData[0].name}</h3>
              <p className="text-sm text-gray-600 font-medium">
                {activeTab === "kitchen" 
                  ? `${leaderboardData[0].ordersCompleted} orders` 
                  : `${leaderboardData[0].ordersServed} served`}
              </p>
              <div className="flex gap-1 mt-2">
                {leaderboardData[0].badges.map((badge, i) => (
                  <span key={i} className="text-lg">{badge}</span>
                ))}
              </div>
              <div className="mt-4 bg-gradient-to-t from-yellow-400 to-yellow-500 text-white px-8 py-12 rounded-t-xl w-full text-center shadow-xl">
                <Trophy className="w-10 h-10 mx-auto mb-2" />
                <p className="text-3xl font-bold">
                  {activeTab === "kitchen" ? leaderboardData[0].rating : leaderboardData[0].customerRating}
                </p>
                <p className="text-sm opacity-90">Rating</p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboardData[2] && (
            <div className="flex flex-col items-center pt-16">
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${getAvatarGradient(2)} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-orange-400`}>
                  {leaderboardData[2].avatar}
                </div>
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 text-center">{leaderboardData[2].name}</h3>
              <p className="text-sm text-gray-600">
                {activeTab === "kitchen" 
                  ? `${leaderboardData[2].ordersCompleted} orders` 
                  : `${leaderboardData[2].ordersServed} served`}
              </p>
              <div className="mt-4 bg-gradient-to-t from-orange-400 to-orange-500 text-white px-6 py-6 rounded-t-xl w-full text-center shadow-lg">
                <Medal className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {activeTab === "kitchen" ? leaderboardData[2].rating : leaderboardData[2].customerRating}
                </p>
                <p className="text-xs opacity-90">Rating</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className={`bg-gradient-to-r ${activeTab === "kitchen" ? "from-green-600 to-green-700" : "from-blue-600 to-blue-700"} px-6 py-4`}>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6" />
              Complete Rankings - {activeTab === "kitchen" ? "Kitchen Staff" : "Waiters"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {activeTab === "kitchen" ? (
              /* Kitchen Table */
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Chef</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Avg Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Accuracy</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboardData.map((staff, index) => {
                    const rankBadge = getRankBadge(index);
                    return (
                      <tr key={staff.id} className={`hover:bg-gray-50 transition ${index < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {rankBadge ? (
                              <div className={`w-10 h-10 rounded-full ${rankBadge.bg} border-2 ${rankBadge.border} flex items-center justify-center`}>
                                <rankBadge.icon className={`w-5 h-5 ${rankBadge.color}`} />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <span className="font-bold text-gray-700">#{index + 1}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(index)} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                              {staff.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <p className="text-xs text-gray-500">Kitchen Staff</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-gray-900">{staff.ordersCompleted}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{staff.avgTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-600 rounded-full"
                                  style={{ width: `${staff.accuracy}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{staff.accuracy}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-gray-900">{staff.rating}</span>
                            <span className="text-xs text-gray-500">/5</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {staff.badges.length > 0 ? (
                              staff.badges.map((badge, i) => (
                                <span key={i} className="text-xl">{badge}</span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No badges</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* Waiter Table */
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Waiter</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Orders Served</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Service Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Tips Earned</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboardData.map((staff, index) => {
                    const rankBadge = getRankBadge(index);
                    return (
                      <tr key={staff.id} className={`hover:bg-gray-50 transition ${index < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {rankBadge ? (
                              <div className={`w-10 h-10 rounded-full ${rankBadge.bg} border-2 ${rankBadge.border} flex items-center justify-center`}>
                                <rankBadge.icon className={`w-5 h-5 ${rankBadge.color}`} />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <span className="font-bold text-gray-700">#{index + 1}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(index)} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                              {staff.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <p className="text-xs text-gray-500">Waiter</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-gray-900">{staff.ordersServed}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{staff.avgServiceTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-green-600">${staff.tips}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-gray-900">{staff.customerRating}</span>
                            <span className="text-xs text-gray-500">/5</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {staff.badges.length > 0 ? (
                              staff.badges.map((badge, i) => (
                                <span key={i} className="text-xl">{badge}</span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No badges</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Badge Legends */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kitchen Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-green-600" />
              Kitchen Staff Badges
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Fire Master</p>
                  <p className="text-xs text-gray-500">Complete 150+ orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Speed Demon</p>
                  <p className="text-xs text-gray-500">Avg prep time under 10 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍🍳</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Master Chef</p>
                  <p className="text-xs text-gray-500">Accuracy 95%+ rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Waiter Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Waiter Badges
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Top Earner</p>
                  <p className="text-xs text-gray-500">Tips earned $1000+</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Star</p>
                  <p className="text-xs text-gray-500">Customer rating 4.5+</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Champion Server</p>
                  <p className="text-xs text-gray-500">Serve 200+ orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}