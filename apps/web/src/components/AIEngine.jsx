import React, { useState } from "react";
import { Brain, Sparkles, Send, Loader2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export function AIEngine() {
  const [prompt, setPrompt] = useState("");
  const [analysisType, setAnalysisType] = useState("traffic_forecast");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: analysisType }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-white/20" size={120} />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Brain size={32} />
            AI Operations Engine
          </h2>
          <p className="text-blue-100 font-medium max-w-lg">
            Predict urban disruptions, analyze city health, and optimize
            resource allocation with UrbanPulse's advanced AI engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Analysis Type</h4>
            <div className="space-y-2">
              {[
                { id: "traffic_forecast", label: "Traffic Forecasting" },
                { id: "leak_detection", label: "Leak Prediction" },
                { id: "hotspot_analysis", label: "Incident Hotspots" },
                {
                  id: "complaint_categorization",
                  label: "Complaint Intelligence",
                },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setAnalysisType(type.id)}
                  className={twMerge(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                    analysisType === type.id
                      ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
                      : "bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100",
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Input Context</h4>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium transition-all"
              placeholder="Enter operational data or scenario description here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !prompt}
              className="mt-4 w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              {loading ? "Processing Insights..." : "Generate Analysis"}
            </button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs">
                  <Zap size={14} />
                  AI Result Generated
                </div>
                <div className="text-slate-400 text-xs font-bold">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="font-black text-slate-900 text-xl mb-2">
                    {result.summary}
                  </h5>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {result.prediction}
                  </p>
                </div>

                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h6 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} />
                    Recommended Action
                  </h6>
                  <p className="text-blue-700 font-medium">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
