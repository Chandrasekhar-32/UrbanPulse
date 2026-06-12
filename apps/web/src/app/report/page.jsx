import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Navigation,
} from "lucide-react";
import useUpload from "@/utils/useUpload";
import { motion, AnimatePresence } from "motion/react";
import { twMerge } from "tailwind-merge";

export default function ReportComplaintPage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    label: null,
  });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [upload, { loading: uploading }] = useUpload();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["complaints-list"] });
    },
  });

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);

      const { url } = await upload({ url: URL.createObjectURL(file) });
      if (url) setImage(url);
    },
    [upload],
  );

  const handleDetectLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        });
        setLocating(false);
      },
      () => {
        setLocationError(
          "Could not get location. Please allow location access.",
        );
        setLocating(false);
      },
      { timeout: 10000 },
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      category,
      description,
      image_url: image,
      latitude: location.lat ?? 40.7128,
      longitude: location.lng ?? -74.006,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full border border-slate-100"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Report Submitted!
          </h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Thank you for helping us build a better city. Your report has been
            logged and assigned to the relevant department.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={20} />
            Return to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Hub
        </a>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-10 text-white">
            <h1 className="text-4xl font-black mb-2">Report an Issue</h1>
            <p className="text-slate-400 font-medium">
              Help city authorities fix problems in your neighborhood.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                What's the issue?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "road", label: "Road Damage" },
                  { id: "water", label: "Water Leak" },
                  { id: "waste", label: "Garbage" },
                  { id: "lighting", label: "Streetlight" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={twMerge(
                      "px-4 py-4 rounded-2xl text-xs font-bold transition-all border-2",
                      category === cat.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20"
                        : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Details
              </label>
              <textarea
                required
                className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium transition-all"
                placeholder="Describe the situation in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Location & Photo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className={twMerge(
                    "flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-colors w-full",
                    location.label
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {locating ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : location.label ? (
                    <Navigation size={20} />
                  ) : (
                    <MapPin size={20} />
                  )}
                  {locating
                    ? "Detecting…"
                    : location.label
                      ? location.label
                      : "Detect Location"}
                </button>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <Camera size={20} />
                    {uploading ? "Uploading..." : "Attach Photo"}
                  </label>
                </div>
              </div>
              {image && (
                <div className="mt-4 rounded-3xl overflow-hidden border-4 border-white shadow-lg h-48">
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    alt="Selected"
                  />
                </div>
              )}
            </div>

            {locationError && (
              <p className="text-red-500 text-sm font-medium mt-2">
                {locationError}
              </p>
            )}

            {mutation.isError && (
              <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl font-bold text-sm">
                <AlertCircle size={20} />
                Failed to submit report. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending || !category || !description}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] text-xl shadow-xl shadow-blue-900/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Submit Official Report"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
