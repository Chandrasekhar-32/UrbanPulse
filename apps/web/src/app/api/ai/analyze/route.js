export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, type } = body;
    const integrationBaseUrl = process.env.NEXT_PUBLIC_CREATE_APP_URL;

    if (!integrationBaseUrl) {
      return Response.json({
        summary: "Local demo analysis completed with sample city operations data.",
        confidence: 0.82,
        prediction: `Expected ${type || "operations"} risk remains moderate over the next cycle.`,
        recommendation:
          "Prioritize high-impact complaints, inspect flagged water zones, and keep emergency dispatch on standby.",
      });
    }

    const response = await fetch(
      `${integrationBaseUrl}/integrations/google-gemini-2-5-pro/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an AI Urban Operations Analyst. Analyze the following data and provide insights/predictions in a JSON format.
            Types: 'traffic_forecast', 'leak_detection', 'hotspot_analysis', 'complaint_categorization'`,
            },
            {
              role: "user",
              content: `Type: ${type}\nData: ${JSON.stringify(prompt)}`,
            },
          ],
          json_schema: {
            name: "urban_analysis",
            schema: {
              type: "object",
              properties: {
                summary: { type: "string" },
                confidence: { type: "number" },
                prediction: { type: "string" },
                recommendation: { type: "string" },
              },
              required: [
                "summary",
                "confidence",
                "prediction",
                "recommendation",
              ],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return Response.json(result);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return Response.json({ error: "AI Analysis failed" }, { status: 500 });
  }
}
