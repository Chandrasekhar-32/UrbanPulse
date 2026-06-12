import React, { useState } from "react";
import useUser from "@/utils/useUser";
import { Sidebar, Header } from "../components/DashboardLayout";
import { OperationsDashboard } from "../components/OperationsDashboard";
import { AIEngine } from "../components/AIEngine";
import { CityMap } from "../components/CityMap";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Brain, Loader2 } from "lucide-react";

export default function MainPage() {
  const { data: user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (userLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 ml-64 min-h-screen">
        <Header user={user} />

        <div className="p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      System Overview
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                      Real-time status of smart city services
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10">
                      <Brain size={20} />
                      Run AI Predictor
                    </button>
                    <button className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                      <AlertCircle size={20} />
                      Emergency SOS
                    </button>
                  </div>
                </div>

                <OperationsDashboard />
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AIEngine />
              </motion.div>
            )}

            {activeTab === "map" && (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CityMap />
              </motion.div>
            )}

            {activeTab !== "dashboard" &&
              activeTab !== "ai" &&
              activeTab !== "map" && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} className="text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 capitalize">
                    {activeTab.replace("_", " ")} View
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-md">
                    We are currently integrating real-time data for this module.
                    Check back soon for the full interactive {activeTab}{" "}
                    experience.
                  </p>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
