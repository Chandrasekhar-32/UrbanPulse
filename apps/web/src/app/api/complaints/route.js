import sql, { hasDatabase } from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { mockComplaints } from "@/app/api/utils/mockData";

export async function GET() {
  try {
    if (!hasDatabase) {
      return Response.json(mockComplaints);
    }

    const complaints = await sql`
      SELECT c.*, u.name as citizen_name 
      FROM complaints c 
      LEFT JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC
    `;
    return Response.json(complaints);
  } catch (error) {
    console.error("Complaints GET Error:", error);
    return Response.json(
      { error: "Failed to fetch complaints" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    if (!hasDatabase) {
      const body = await request.json();
      return Response.json({
        id: Date.now(),
        status: "pending",
        created_at: new Date().toISOString(),
        ...body,
      });
    }

    const session = await auth();
    const body = await request.json();
    const { category, description, latitude, longitude, image_url } = body;

    const result = await sql`
      INSERT INTO complaints (user_id, category, description, latitude, longitude, image_url)
      VALUES (${session?.user?.id || null}, ${category}, ${description}, ${latitude}, ${longitude}, ${image_url})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Complaints POST Error:", error);
    return Response.json(
      { error: "Failed to create complaint" },
      { status: 500 },
    );
  }
}
