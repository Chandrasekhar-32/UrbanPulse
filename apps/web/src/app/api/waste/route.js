import sql, { hasDatabase } from "@/app/api/utils/sql";
import { mockWaste } from "@/app/api/utils/mockData";

export async function GET() {
  try {
    if (!hasDatabase) {
      return Response.json(mockWaste);
    }

    const waste = await sql`SELECT * FROM waste_data ORDER BY recorded_at DESC`;
    return Response.json(waste);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch waste data" },
      { status: 500 },
    );
  }
}
