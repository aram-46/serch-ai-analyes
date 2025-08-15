import { GoogleGenAI, Type } from "@google/genai";
import type { SearchQuery, SearchResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    keywords: {
      type: Type.ARRAY,
      description: "Generated keywords based on the topic.",
      items: { type: Type.STRING }
    },
    comparisonSummary: {
      type: Type.STRING,
      description: "AI-generated text analysis comparing the two regions based on the provided data."
    },
    visualData: {
      type: Type.ARRAY,
      description: "Data formatted for bar charts. Provide at least 5 data points for comparison. The 'name' should be a comparable metric (e.g., year, sub-category). 'region1' and 'region2' are the numeric values for the respective regions passed in the prompt.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The data point name (e.g., year, sub-category)." },
          region1: { type: Type.NUMBER, description: "Value for the first region." },
          region2: { type: Type.NUMBER, description: "Value for the second region." }
        },
        required: ["name", "region1", "region2"],
      }
    },
    sources: {
      type: Type.ARRAY,
      description: "A list of data sources used. Find at least 3-5 academic or official sources.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the research center or publication." },
          credibilityScore: { type: Type.NUMBER, description: "A score from 1-10 on the source's credibility." },
          credibilityAnalysis: { type: Type.STRING, description: "Brief explanation of the credibility score." },
          statisticalPopulation: { type: Type.STRING },
          surveyType: { type: Type.STRING },
          participantCount: { type: Type.INTEGER },
          methodology: { type: Type.STRING },
          year: { type: Type.STRING, description: "Year or range of years for the data." },
          isStillValid: { type: Type.BOOLEAN },
          link: { type: Type.STRING, description: "Direct URL to the source." }
        },
        required: ["name", "credibilityScore", "credibilityAnalysis", "link", "year", "isStillValid"],
      }
    },
    relatedResearch: {
      type: Type.ARRAY,
      description: "List of 2-3 related research studies.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          source: { type: Type.STRING },
          link: { type: Type.STRING }
        },
        required: ["title", "summary", "source", "link"],
      }
    }
  },
  required: ["keywords", "comparisonSummary", "visualData", "sources", "relatedResearch"],
};

export const fetchStatisticalAnalysis = async (query: Omit<SearchQuery, 'id' | 'name'>): Promise<SearchResult> => {
  const prompt = `
    Act as a professional data analyst and researcher. Your task is to perform a detailed statistical comparison based on the following query.
    
    **Research Topic:** ${query.topic}
    **Subject Area:** ${query.subject}
    
    **Region for Comparison 1:** ${query.region1}
    **Region for Comparison 2:** ${query.region2}
    
    **User-Provided Keywords (use these to guide search):** ${query.keywords || 'N/A'}
    **User-Provided Sources (prioritize these if relevant):** ${query.userSources || 'N/A'}
    
    **Instructions:**
    1.  **Analyze and Generate Keywords:** If user keywords are sparse, generate a comprehensive list of relevant keywords for the search.
    2.  **Search for Data:** Simulate searching reputable, scientific, and academic sources (like World Bank Data, Google Scholar, national statistics offices, etc.) for statistical data related to the topic and subject. If user-provided sources are available, focus your search there.
    3.  **Validate Sources:** For each source you find, assess its credibility. Provide a credibility score and a brief analysis.
    4.  **Extract & Compare Data:** Extract relevant statistical data. Create a structured comparison between '${query.region1}' (region1) and '${query.region2}' (region2).
    5.  **Find Related Research:** Identify a few academic papers or studies related to the main topic.
    6.  **Format Output:** Return the entire response as a single, valid JSON object that strictly adheres to the provided schema. Ensure all fields are populated with high-quality, relevant information. Do not output anything other than the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText) as SearchResult;
    
    // Rename keys in visualData for recharts
    result.visualData = result.visualData.map(item => ({
        ...item,
        [query.region1]: item.region1,
        [query.region2]: item.region2,
    }));

    return result;

  } catch (error) {
    console.error("Error fetching statistical analysis from Gemini:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
      throw new Error("Invalid or missing API Key. Please check your environment configuration.");
    }
    throw new Error("Failed to get a valid response from the AI. The model may be unavailable or the request was malformed.");
  }
};

export const generateKeywordsFromTopic = async (topic: string): Promise<string[]> => {
    const prompt = `Based on the research topic "${topic}", generate a comma-separated list of 5-10 relevant keywords for a statistical database search. Only output the keywords.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.split(',').map(k => k.trim());
    } catch(error) {
        console.error("Error generating keywords:", error);
        return [];
    }
};