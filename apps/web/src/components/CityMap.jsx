"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { useQuery } from "@tanstack/react-query";
import {
  Navigation,
  Layers,
  MapPin,
  X,
  AlertTriangle,
  Truck,
  Droplets,
  Zap,
  Car,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// ─── Layer configuration ────────────────────────────────────────────
const LAYER_CONFIG = {
  complaints: { label: "Complaints", color: "#f59e0b", icon: AlertTriangle },
  traffic: { label: "Traffic", color: "#ef4444", icon: Car },
  emergency: { label: "Emergency", color: "#9333ea", icon: Zap },
  waste: { label: "Waste Bins", color: "#10b981", icon: Truck },
  water: { label: "Water", color: "#3b82f6", icon: Droplets },
};

// ─── SVG pin maker (no mapId needed – works with legacy Marker) ──────
const makePin = (color, size = 28) => ({
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="${size}" height="${Math.round(size * 1.31)}">
      <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0008"/></filter></defs>
      <path filter="url(#s)" d="M16 0C7.163 0 0 7.163 0 16c0 5.202 2.503 9.815 6.388 12.75L16 42l9.612-13.25C29.497 25.815 32 21.202 32 16 32 7.163 24.837 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.9"/>
    </svg>`,
  )}`,
});

const myLocationPin = {
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="2"/>
      <circle cx="20" cy="20" r="8" fill="#4f46e5"/>
      <circle cx="20" cy="20" r="4" fill="white"/>
    </svg>`,
  )}`,
};

// ─── Demo/fallback data (NYC area) ───────────────────────────────────
const DEMO = {
  complaints: [
    {
      id: "dc1",
      category: "road",
      description: "Large pothole on 5th Ave causing traffic delays",
      latitude: 40.7549,
      longitude: -73.984,
      status: "pending",
    },
    {
      id: "dc2",
      category: "waste",
      description: "Overflowing garbage bin near Central Park south",
      latitude: 40.7651,
      longitude: -73.9773,
      status: "active",
    },
    {
      id: "dc3",
      category: "lighting",
      description: "Streetlight out for 3 days on W 42nd St",
      latitude: 40.7559,
      longitude: -73.9871,
      status: "pending",
    },
    {
      id: "dc4",
      category: "water",
      description: "Water leaking from main supply pipe",
      latitude: 40.7282,
      longitude: -73.7949,
      status: "active",
    },
    {
      id: "dc5",
      category: "road",
      description: "Broken sidewalk near school zone",
      latitude: 40.6892,
      longitude: -74.0445,
      status: "resolved",
    },
  ],
  traffic: [
    {
      id: "tt1",
      location_name: "Times Square",
      latitude: 40.758,
      longitude: -73.9855,
      congestion_level: 9,
      vehicle_count: 1850,
    },
    {
      id: "tt2",
      location_name: "Grand Central",
      latitude: 40.7527,
      longitude: -73.9772,
      congestion_level: 6,
      vehicle_count: 980,
    },
    {
      id: "tt3",
      location_name: "Holland Tunnel",
      latitude: 40.7282,
      longitude: -74.0091,
      congestion_level: 8,
      vehicle_count: 1620,
    },
    {
      id: "tt4",
      location_name: "FDR Drive South",
      latitude: 40.7128,
      longitude: -73.976,
      congestion_level: 4,
      vehicle_count: 540,
    },
    {
      id: "tt5",
      location_name: "Brooklyn Bridge",
      latitude: 40.7061,
      longitude: -73.9969,
      congestion_level: 7,
      vehicle_count: 1240,
    },
    {
      id: "tt6",
      location_name: "Lincoln Tunnel",
      latitude: 40.7618,
      longitude: -73.9998,
      congestion_level: 5,
      vehicle_count: 760,
    },
  ],
  emergency: [
    {
      id: "ee1",
      type: "Fire",
      latitude: 40.7459,
      longitude: -73.9896,
      severity: "high",
      status: "active",
    },
    {
      id: "ee2",
      type: "Accident",
      latitude: 40.6892,
      longitude: -74.0145,
      severity: "medium",
      status: "responding",
    },
    {
      id: "ee3",
      type: "Medical",
      latitude: 40.7831,
      longitude: -73.9712,
      severity: "low",
      status: "resolved",
    },
    {
      id: "ee4",
      type: "Flood",
      latitude: 40.72,
      longitude: -73.957,
      severity: "high",
      status: "active",
    },
  ],
  waste: [
    {
      id: "ww1",
      bin_id: "BIN-001",
      latitude: 40.758,
      longitude: -73.9855,
      fill_level: 92,
    },
    {
      id: "ww2",
      bin_id: "BIN-002",
      latitude: 40.7851,
      longitude: -73.9683,
      fill_level: 45,
    },
    {
      id: "ww3",
      bin_id: "BIN-003",
      latitude: 40.7061,
      longitude: -73.9969,
      fill_level: 78,
    },
    {
      id: "ww4",
      bin_id: "BIN-004",
      latitude: 40.6501,
      longitude: -73.9496,
      fill_level: 20,
    },
    {
      id: "ww5",
      bin_id: "BIN-005",
      latitude: 40.7282,
      longitude: -74.0059,
      fill_level: 61,
    },
  ],
  water: [
    {
      id: "wa1",
      area_name: "Lower Manhattan",
      latitude: 40.7128,
      longitude: -74.0059,
      usage_liters: 15000,
      leakage_detected: true,
      pressure_level: 4.2,
    },
    {
      id: "wa2",
      area_name: "Midtown",
      latitude: 40.7549,
      longitude: -73.984,
      usage_liters: 28000,
      leakage_detected: false,
      pressure_level: 6.8,
    },
    {
      id: "wa3",
      area_name: "Upper West Side",
      latitude: 40.787,
      longitude: -73.9754,
      usage_liters: 9500,
      leakage_detected: false,
      pressure_level: 5.5,
    },
    {
      id: "wa4",
      area_name: "Brooklyn Heights",
      latitude: 40.6928,
      longitude: -73.995,
      usage_liters: 19000,
      leakage_detected: true,
      pressure_level: 3.1,
    },
  ],
};

// ─── Sub-component: pans the map programmatically ────────────────────
function MapController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target.center);
      map.setZoom(target.zoom ?? 14);
    }
  }, [map, target]);
  return null;
}

// ─── Info window content ─────────────────────────────────────────────
function InfoContent({ item }) {
  const { type, data } = item;
  const base = { fontFamily: "system-ui, sans-serif", minWidth: 200 };

  const Badge = ({ label, color }) => (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        background: color + "20",
        color,
        fontWeight: 700,
        fontSize: 11,
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );

  if (type === "complaint")
    return (
      <div style={base}>
        <p
          style={{
            fontWeight: 800,
            fontSize: 15,
            margin: "0 0 6px",
            textTransform: "capitalize",
          }}
        >
          {data.category} Issue
        </p>
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            margin: "0 0 10px",
            lineHeight: 1.5,
          }}
        >
          {data.description}
        </p>
        <Badge
          label={data.status}
          color={
            data.status === "pending"
              ? "#d97706"
              : data.status === "active"
                ? "#2563eb"
                : "#16a34a"
          }
        />
      </div>
    );

  if (type === "traffic") {
    const cColor =
      data.congestion_level >= 8
        ? "#dc2626"
        : data.congestion_level >= 5
          ? "#f97316"
          : "#16a34a";
    const pct = (data.congestion_level / 10) * 100;
    return (
      <div style={base}>
        <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 8px" }}>
          🚦 {data.location_name}
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 2px" }}>
          Vehicles: <strong>{data.vehicle_count?.toLocaleString()}</strong>
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>
          Congestion:{" "}
          <strong style={{ color: cColor }}>{data.congestion_level}/10</strong>
        </p>
        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3 }}>
          <div
            style={{
              height: 6,
              width: `${pct}%`,
              background: cColor,
              borderRadius: 3,
              transition: "width 0.4s",
            }}
          />
        </div>
      </div>
    );
  }

  if (type === "emergency")
    return (
      <div style={base}>
        <p
          style={{
            fontWeight: 800,
            fontSize: 15,
            color: "#7c3aed",
            margin: "0 0 6px",
          }}
        >
          🚨 {data.type} Incident
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>
          Severity: <strong>{data.severity}</strong>
        </p>
        <Badge
          label={data.status}
          color={
            data.status === "active"
              ? "#dc2626"
              : data.status === "responding"
                ? "#d97706"
                : "#16a34a"
          }
        />
      </div>
    );

  if (type === "waste") {
    const fc =
      data.fill_level >= 80
        ? "#dc2626"
        : data.fill_level >= 50
          ? "#f97316"
          : "#16a34a";
    return (
      <div style={base}>
        <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 6px" }}>
          🗑️ Bin {data.bin_id}
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>
          Fill Level: <strong style={{ color: fc }}>{data.fill_level}%</strong>
          {data.fill_level >= 80 && " — Needs collection!"}
        </p>
        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4 }}>
          <div
            style={{
              height: 8,
              width: `${data.fill_level}%`,
              background: fc,
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    );
  }

  if (type === "water")
    return (
      <div style={base}>
        <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 6px" }}>
          💧 {data.area_name}
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px" }}>
          Usage: <strong>{data.usage_liters?.toLocaleString()} L</strong>
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px" }}>
          Pressure: <strong>{data.pressure_level} bar</strong>
        </p>
        {data.leakage_detected && (
          <p
            style={{
              fontSize: 13,
              color: "#dc2626",
              fontWeight: 700,
              margin: 0,
            }}
          >
            ⚠️ Leakage Detected!
          </p>
        )}
      </div>
    );

  return null;
}

// ─── Main CityMap component ───────────────────────────────────────────
export function CityMap() {
  const [myLocation, setMyLocation] = useState(null);
  const [mapTarget, setMapTarget] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    complaints: true,
    traffic: true,
    emergency: true,
    waste: true,
    water: true,
  });

  // ── Fetch live data ───────────────────────────────────────────────
  const fetchJSON = async (url, key) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const d = await res.json();
      return Array.isArray(d) ? d : d[key] || d?.data || [];
    } catch {
      return [];
    }
  };

  const {
    data: complaintsRaw = [],
    refetch: refetchAll,
    isFetching,
  } = useQuery({
    queryKey: ["map-complaints"],
    queryFn: () => fetchJSON("/api/complaints", "complaints"),
  });
  const { data: trafficRaw = [] } = useQuery({
    queryKey: ["map-traffic"],
    queryFn: () => fetchJSON("/api/traffic", "traffic"),
  });
  const { data: emergencyRaw = [] } = useQuery({
    queryKey: ["map-emergency"],
    queryFn: () => fetchJSON("/api/emergency", "incidents"),
  });
  const { data: wasteRaw = [] } = useQuery({
    queryKey: ["map-waste"],
    queryFn: () => fetchJSON("/api/waste", "bins"),
  });
  const { data: waterRaw = [] } = useQuery({
    queryKey: ["map-water"],
    queryFn: () => fetchJSON("/api/water", "water"),
  });

  // ── Use demo data as fallback ─────────────────────────────────────
  const complaints = complaintsRaw.length > 0 ? complaintsRaw : DEMO.complaints;
  const traffic = trafficRaw.length > 0 ? trafficRaw : DEMO.traffic;
  const emergency = emergencyRaw.length > 0 ? emergencyRaw : DEMO.emergency;
  const waste = wasteRaw.length > 0 ? wasteRaw : DEMO.waste;
  const water = waterRaw.length > 0 ? waterRaw : DEMO.water;

  // ── Geolocation ───────────────────────────────────────────────────
  const handleMyLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyLocation(loc);
        setMapTarget({ center: loc, zoom: 15 });
        setLocating(false);
      },
      (err) => {
        setLocationError(
          "Could not get your location. Please allow location access.",
        );
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 30000 },
    );
  }, []);

  const toggleLayer = (key) =>
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Count helpers ─────────────────────────────────────────────────
  const counts = {
    complaints: complaints.length,
    traffic: traffic.length,
    emergency: emergency.length,
    waste: waste.length,
    water: water.length,
  };
  const totalActive =
    emergency.filter((e) => e.status === "active").length +
    complaints.filter((c) => c.status !== "resolved").length;

  // ── Traffic color helper ──────────────────────────────────────────
  const trafficColor = (level) =>
    level >= 8 ? "#dc2626" : level >= 5 ? "#f97316" : "#16a34a";

  // ── Waste color helper ────────────────────────────────────────────
  const wasteColor = (fill) =>
    fill >= 80 ? "#dc2626" : fill >= 50 ? "#f97316" : "#10b981";

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Smart City Map
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Live view of&nbsp;
            <span className="text-slate-800 font-bold">
              {totalActive} active incidents
            </span>
            &nbsp;across the city
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetchAll()}
            disabled={isFetching}
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={handleMyLocation}
            disabled={locating}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-60"
          >
            <Navigation size={18} className={locating ? "animate-pulse" : ""} />
            {locating
              ? "Locating…"
              : myLocation
                ? "My Location"
                : "Show My Location"}
          </button>
        </div>
      </div>

      {locationError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
          <AlertTriangle size={16} />
          {locationError}
          <button onClick={() => setLocationError(null)} className="ml-auto">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Layer toggles ── */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 self-center">
          <Layers size={14} /> Layers:
        </span>
        {Object.entries(LAYER_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const active = activeLayers[key];
          return (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all"
              style={
                active
                  ? {
                      backgroundColor: cfg.color,
                      borderColor: cfg.color,
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "#fff",
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                    }
              }
            >
              {active ? <Eye size={13} /> : <EyeOff size={13} />}
              <Icon size={13} />
              {cfg.label}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={
                  active
                    ? { background: "rgba(255,255,255,0.25)" }
                    : { background: "#f1f5f9" }
                }
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Map ── */}
      <div
        className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl"
        style={{ height: 560 }}
      >
        <APIProvider apiKey={API_KEY ?? ""}>
          <Map
            defaultCenter={{ lat: 40.7128, lng: -74.006 }}
            defaultZoom={12}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Pan/zoom controller */}
            <MapController target={mapTarget} />

            {/* My location marker */}
            {myLocation && (
              <Marker
                position={myLocation}
                icon={myLocationPin}
                title="You are here"
                zIndex={1000}
              />
            )}

            {/* ── Complaint markers ── */}
            {activeLayers.complaints &&
              complaints
                .filter((c) => c.latitude && c.longitude)
                .map((c) => (
                  <Marker
                    key={`c-${c.id}`}
                    position={{
                      lat: Number(c.latitude),
                      lng: Number(c.longitude),
                    }}
                    icon={makePin(LAYER_CONFIG.complaints.color)}
                    title={`Complaint: ${c.category}`}
                    onClick={() =>
                      setSelectedItem({ type: "complaint", data: c })
                    }
                  />
                ))}

            {/* ── Traffic markers ── */}
            {activeLayers.traffic &&
              traffic
                .filter((t) => t.latitude && t.longitude)
                .map((t) => (
                  <Marker
                    key={`t-${t.id}`}
                    position={{
                      lat: Number(t.latitude),
                      lng: Number(t.longitude),
                    }}
                    icon={makePin(trafficColor(t.congestion_level))}
                    title={t.location_name}
                    onClick={() =>
                      setSelectedItem({ type: "traffic", data: t })
                    }
                  />
                ))}

            {/* ── Emergency markers ── */}
            {activeLayers.emergency &&
              emergency
                .filter((e) => e.latitude && e.longitude)
                .map((e) => (
                  <Marker
                    key={`e-${e.id}`}
                    position={{
                      lat: Number(e.latitude),
                      lng: Number(e.longitude),
                    }}
                    icon={makePin(LAYER_CONFIG.emergency.color, 34)}
                    title={`Emergency: ${e.type}`}
                    onClick={() =>
                      setSelectedItem({ type: "emergency", data: e })
                    }
                  />
                ))}

            {/* ── Waste markers ── */}
            {activeLayers.waste &&
              waste
                .filter((w) => w.latitude && w.longitude)
                .map((w) => (
                  <Marker
                    key={`w-${w.id}`}
                    position={{
                      lat: Number(w.latitude),
                      lng: Number(w.longitude),
                    }}
                    icon={makePin(wasteColor(w.fill_level))}
                    title={`Bin ${w.bin_id} — ${w.fill_level}% full`}
                    onClick={() => setSelectedItem({ type: "waste", data: w })}
                  />
                ))}

            {/* ── Water markers ── */}
            {activeLayers.water &&
              water
                .filter((w) => w.latitude && w.longitude)
                .map((w) => (
                  <Marker
                    key={`wa-${w.id}`}
                    position={{
                      lat: Number(w.latitude),
                      lng: Number(w.longitude),
                    }}
                    icon={makePin(
                      w.leakage_detected ? "#dc2626" : LAYER_CONFIG.water.color,
                    )}
                    title={w.area_name}
                    onClick={() => setSelectedItem({ type: "water", data: w })}
                  />
                ))}

            {/* ── Info window ── */}
            {selectedItem &&
              selectedItem.data.latitude &&
              selectedItem.data.longitude && (
                <InfoWindow
                  position={{
                    lat: Number(selectedItem.data.latitude),
                    lng: Number(selectedItem.data.longitude),
                  }}
                  onCloseClick={() => setSelectedItem(null)}
                >
                  <InfoContent item={selectedItem} />
                </InfoWindow>
              )}
          </Map>
        </APIProvider>
      </div>

      {/* ── Legend & stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(LAYER_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div
              key={key}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleLayer(key)}
              style={{ opacity: activeLayers[key] ? 1 : 0.4 }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.color + "18" }}
              >
                <Icon size={20} style={{ color: cfg.color }} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {counts[key]}
                </div>
                <div className="text-xs text-slate-500 font-semibold leading-tight">
                  {cfg.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick tip ── */}
      <p className="text-center text-xs text-slate-400 font-medium">
        Click any marker to see details · Toggle layers above · Click a stat
        card to hide/show that layer
      </p>
    </div>
  );
}
