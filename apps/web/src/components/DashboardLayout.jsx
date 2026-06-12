import React from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  AlertTriangle,
  Activity,
  Droplets,
  Trash2,
  Navigation,
  Settings,
  Bell,
  Search,
  User,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: "dashboard", label: "Operations", icon: LayoutDashboard },
    { id: "map", label: "City Map", icon: MapIcon },
    { id: "complaints", label: "Complaints", icon: AlertTriangle },
    { id: "traffic", label: "Traffic", icon: Navigation },
    { id: "water", label: "Water", icon: Droplets },
    { id: "waste", label: "Waste", icon: Trash2 },
    { id: "emergency", label: "Emergency", icon: ShieldAlert },
    { id: "ai", label: "AI Engine", icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
          U
        </div>
        <h1 className="text-xl font-bold tracking-tight">UrbanPulse</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={twMerge(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white",
            )}
          >
            <item.icon
              size={20}
              className={
                activeTab === item.id
                  ? "text-white"
                  : "group-hover:scale-110 transition-transform"
              }
            />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

export function Header({ user }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full w-96 max-w-full">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search city operations..."
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell
            size={20}
            className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
          />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {user?.role || "Visitor"}
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {user?.image ? (
              <img
                src={user.image}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-slate-500" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={twMerge("p-3 rounded-xl", colorClass)}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={twMerge(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              trend > 0
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600",
            )}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-slate-400 font-medium">
            vs last 24h
          </span>
        </div>
      )}
    </motion.div>
  );
}
