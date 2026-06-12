import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  ChevronRight,
  TrendingUp,
  Brain,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export function OperationsDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      return res.json();
    },
  });

  const { data: complaints } = useQuery({
    queryKey: ["complaints-list"],
    queryFn: async () => {
      const res = await fetch("/api/complaints");
      return res.json();
    },
  });

  const chartData = [
    { name: "Mon", count: 45 },
    { name: "Tue", count: 52 },
    { name: "Wed", count: 38 },
    { name: "Thu", count: 65 },
    { name: "Fri", count: 48 },
    { name: "Sat", count: 25 },
    { name: "Sun", count: 18 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem
          title="Active Complaints"
          value={stats?.activeComplaints || 0}
          icon={AlertCircle}
          trend={12}
          color="bg-orange-50 text-orange-600"
        />
        <StatItem
          title="Traffic Congestion"
          value={stats?.trafficCongestionZones || 0}
          icon={TrendingUp}
          trend={-5}
          color="bg-blue-50 text-blue-600"
        />
        <StatItem
          title="Water Leaks"
          value={stats?.waterLeaks || 0}
          icon={Activity}
          trend={2}
          color="bg-cyan-50 text-cyan-600"
        />
        <StatItem
          title="Emergencies"
          value={stats?.activeEmergencies || 0}
          icon={Brain}
          trend={0}
          color="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Issue Volume Trends
              </h3>
              <p className="text-sm text-slate-500">
                System-wide performance monitoring
              </p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">
              Recent Complaints
            </h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {complaints?.slice(0, 5).map((complaint) => (
              <div
                key={complaint.id}
                className="flex gap-4 group cursor-pointer"
              >
                <div
                  className={twMerge(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                    getCategoryColor(complaint.category),
                  )}
                >
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 truncate capitalize">
                      {complaint.category.replace("_", " ")}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {new Date(complaint.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {complaint.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={twMerge(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest",
                        getStatusColor(complaint.status),
                      )}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!complaints || complaints.length === 0) && (
              <div className="text-center py-8 text-slate-400 italic">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ title, value, icon: Icon, trend, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={twMerge("p-3 rounded-2xl", color)}>
          <Icon size={24} />
        </div>
        {trend !== 0 && (
          <div
            className={twMerge(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              trend > 0
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600",
            )}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-4xl font-black text-slate-900">{value}</h3>
      <p className="text-slate-500 font-medium mt-1 text-sm">{title}</p>
    </motion.div>
  );
}

const getCategoryColor = (cat) => {
  switch (cat) {
    case "road":
      return "bg-orange-100 text-orange-600";
    case "water":
      return "bg-blue-100 text-blue-600";
    case "waste":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-600";
    case "resolved":
      return "bg-green-50 text-green-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
};
