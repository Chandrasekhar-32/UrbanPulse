import sql, { hasDatabase } from "@/app/api/utils/sql";
import { mockEmergencies } from "@/app/api/utils/mockData";

export async function GET() {
  try {
    if (!hasDatabase) {
      return Response.json(mockEmergencies);
    }

    const emergencies =
      await sql`SELECT * FROM emergency_incidents ORDER BY reported_at DESC`;
    return Response.json(emergencies);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch emergency data" },
      { status: 500 },
    );
  }
}
