import sql, { hasDatabase } from "@/app/api/utils/sql";
import { mockStats } from "@/app/api/utils/mockData";

export async function GET() {
  try {
    if (!hasDatabase) {
      return Response.json(mockStats);
    }

    const [
      trafficCount,
      waterCount,
      wasteCount,
      complaintCount,
      emergencyCount,
    ] = await sql.transaction([
      sql`SELECT COUNT(*) as count FROM traffic_data`,
      sql`SELECT COUNT(*) as count FROM water_data WHERE leakage_detected = TRUE`,
      sql`SELECT COUNT(*) as count FROM waste_data WHERE fill_level > 80`,
      sql`SELECT COUNT(*) as count FROM complaints WHERE status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM emergency_incidents WHERE status != 'resolved'`,
    ]);

    return Response.json({
      activeComplaints: parseInt(complaintCount[0].count),
      trafficCongestionZones: parseInt(trafficCount[0].count),
      waterLeaks: parseInt(waterCount[0].count),
      criticalBins: parseInt(wasteCount[0].count),
      activeEmergencies: parseInt(emergencyCount[0].count),
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
