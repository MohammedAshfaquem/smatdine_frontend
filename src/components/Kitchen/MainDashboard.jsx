// src/components/kitchen/MainDashboard.jsx
import React from "react";
import { Clock, Package, CheckCircle, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

export default function MainDashboard({ stats }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Dashboard</h1>
      <p className="text-gray-600 mb-6">Overview of kitchen operations</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Clock} label="Pending Orders" value={stats.pending} color="bg-orange-500" />
        <StatCard icon={Package} label="Preparing" value={stats.preparing} color="bg-blue-500" />
        <StatCard icon={CheckCircle} label="Ready to Serve" value={stats.ready} color="bg-green-600" />
        <StatCard icon={TrendingUp} label="Total Today" value={stats.total} color="bg-purple-500" />
      </div>
    </div>
  );
}
