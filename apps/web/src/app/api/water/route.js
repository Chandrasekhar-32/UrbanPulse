import sql, { hasDatabase } from "@/app/api/utils/sql";
import { mockWater } from "@/app/api/utils/mockData";

export async function GET() {
  try {
    if (!hasDatabase) {
      return Response.json(mockWater);
    }

    const water = await sql`SELECT * FROM water_data ORDER BY recorded_at DESC`;
    return Response.json(water);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch water data" },
      { status: 500 },
    );
  }
}
