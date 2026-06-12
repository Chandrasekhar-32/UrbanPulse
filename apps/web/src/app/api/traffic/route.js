import sql, { hasDatabase } from "@/app/api/utils/sql";
import { mockTraffic } from "@/app/api/utils/mockData";

export async function GET() {
  try {
    if (!hasDatabase) {
      return Response.json(mockTraffic);
    }

    const traffic =
      await sql`SELECT * FROM traffic_data ORDER BY recorded_at DESC`;
    return Response.json(traffic);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch traffic data" },
      { status: 500 },
    );
  }
}
