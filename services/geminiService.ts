import { GoogleGenAI } from "@google/genai";
import { Quote } from "../types";

// Initialize the Gemini client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDashboardInsights = async (quotes: Quote[]): Promise<string> => {
  const client = getClient();
  if (!client) return "Unable to generate insights: API Key missing.";

  // Summarize data to avoid sending too much tokens
  const totalQuotes = quotes.length;
  const totalRevenue = quotes.reduce((acc, q) => acc + q.quoteAmount, 0);
  const avgValue = totalRevenue / totalQuotes;
  
  // Group by service type
  const serviceCounts = quotes.reduce((acc, q) => {
    acc[q.serviceType] = (acc[q.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
    You are an expert business analyst for a Roofing Company using an AI Quotebot.
    Analyze the following performance metrics for the last 30 days and provide 3 brief, actionable insights or observations.
    Focus on revenue opportunities, conversion trends, or operational advice.
    
    Data Summary:
    - Total Quotes Generated: ${totalQuotes}
    - Total Potential Revenue: $${totalRevenue.toLocaleString()}
    - Average Quote Value: $${Math.floor(avgValue).toLocaleString()}
    - Breakdown by Service: ${JSON.stringify(serviceCounts)}
    
    Format the output as a simple HTML unordered list (<ul><li>...</li></ul>) without markdown code blocks. Keep it professional and motivating.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to retrieve AI insights at this time.";
  }
};
