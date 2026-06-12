const now = new Date();

export const mockStats = {
  activeComplaints: 8,
  trafficCongestionZones: 5,
  waterLeaks: 2,
  criticalBins: 4,
  activeEmergencies: 1,
};

export const mockComplaints = [
  {
    id: 1,
    category: "road",
    description: "Pothole reported near the central junction.",
    status: "pending",
    created_at: now.toISOString(),
    citizen_name: "Local Resident",
  },
  {
    id: 2,
    category: "water",
    description: "Possible pipe leakage detected in sector 12.",
    status: "in_progress",
    created_at: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
    citizen_name: "Maintenance Team",
  },
  {
    id: 3,
    category: "waste",
    description: "Overflowing waste bin beside market road.",
    status: "pending",
    created_at: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
    citizen_name: "Sanitation Desk",
  },
];

export const mockTraffic = [
  { id: 1, zone: "Central Junction", congestion_level: 82, recorded_at: now.toISOString() },
  { id: 2, zone: "Market Road", congestion_level: 61, recorded_at: now.toISOString() },
];

export const mockWater = [
  { id: 1, zone: "Sector 12", pressure: 42, leakage_detected: true, recorded_at: now.toISOString() },
  { id: 2, zone: "North Tank", pressure: 76, leakage_detected: false, recorded_at: now.toISOString() },
];

export const mockWaste = [
  { id: 1, bin_id: "BIN-104", location: "Market Road", fill_level: 92, recorded_at: now.toISOString() },
  { id: 2, bin_id: "BIN-217", location: "Bus Stand", fill_level: 67, recorded_at: now.toISOString() },
];

export const mockEmergencies = [
  {
    id: 1,
    type: "medical",
    location: "Central Junction",
    status: "active",
    reported_at: now.toISOString(),
  },
];
