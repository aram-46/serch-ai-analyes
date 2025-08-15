import { GoogleGenAI, Type } from "@google/genai";
import type { SearchQuery, SearchResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchStatisticalAnalysis = async (query: Omit<SearchQuery, 'id' | 'name'>): Promise<SearchResult> => {
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
        description: "Data formatted for charts. Provide at least 5 data points for comparison. The 'name' should be a comparable metric (e.g., year, sub-category).",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The data point name (e.g., year, sub-category)." },
            region1: { type: Type.NUMBER, description: `Value for ${query.region1}. The key for this field must be exactly 'region1'.` },
            region2: { type: Type.NUMBER, description: `Value for ${query.region2}. The key for this field must be exactly 'region2'.` }
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
        description: "List of 2-4 related research studies. For each, provide a detailed analysis.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            source: { type: Type.STRING },
            link: { type: Type.STRING },
            year: { type: Type.STRING, description: "Year of publication." },
            credibilityScore: { type: Type.NUMBER, description: "A score from 1-10 on the source's credibility." },
            credibilityAnalysis: { type: Type.STRING, description: "Brief explanation of the credibility score for the research." },
            isStillValid: { type: Type.BOOLEAN },
            proponentViews: { type: Type.STRING, description: "A summary of viewpoints that support or align with this research. If none are found, this can be an empty string."},
            opposingViews: { type: Type.STRING, description: "A summary of viewpoints that challenge or oppose this research. If none are found, this can be an empty string."}
          },
          required: ["title", "summary", "source", "link", "year", "credibilityScore", "credibilityAnalysis", "isStillValid"],
        }
      },
      suggestedQueries: {
          type: Type.ARRAY,
          description: "Generate 3-4 related but distinct search topics based on the user's initial query.",
          items: { type: Type.STRING }
      }
    },
    required: ["keywords", "comparisonSummary", "visualData", "sources", "relatedResearch", "suggestedQueries"],
  };

  const prompt = `
    Act as a professional data analyst and researcher. Your task is to perform a detailed statistical comparison based on the following query.
    
    **Research Topic:** ${query.topic}
    **Subject Area:** ${query.subject}
    
    **Region for Comparison 1:** ${query.region1}
    **Region for Comparison 2:** ${query.region2}
    
    **User-Provided Keywords (use these to guide search):** ${query.keywords || 'N/A'}
    **User-Provided Sources (prioritize these if relevant):** ${query.userSources || 'N/A'}
    
    **Advanced Search Parameters:**
    - **EMPHASIZE:** Focus search and analysis on these aspects: ${query.emphasis || 'N/A'}.
    - **EXCLUDE:** Do NOT use sources or data related to these points: ${query.exclusions || 'N/A'}.

    **Instructions:**
    1.  **Analyze and Generate Keywords:** If user keywords are sparse, generate a comprehensive list of relevant keywords for the search, considering the emphasis and exclusion criteria.
    2.  **Search for Data:** Simulate searching reputable, scientific, and academic sources, adhering strictly to the exclusion list. Prioritize user sources if provided.
    3.  **Validate Sources & Research:** For each source and related research, provide a detailed credibility assessment.
    4.  **Extract & Compare Data:** Extract relevant statistical data. Create a structured comparison between '${query.region1}' (as 'region1') and '${query.region2}' (as 'region2').
    5.  **Analyze Viewpoints:** For related research, analyze and summarize both proponent and opposing viewpoints to provide a balanced perspective. If these viewpoints are not readily available, you can leave the corresponding fields empty.
    6.  **Suggest Next Steps:** Generate a list of related search queries to guide further research.
    7.  **Format Output:** Return the entire response as a single, valid JSON object that strictly adheres to the provided schema. Ensure all fields are populated with high-quality, relevant information. Do not output anything other than the JSON object.
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
     if (error instanceof Error && error.message.includes("Rpc failed due to xhr error")) {
        throw new Error("The AI model failed to generate a response due to a network error. This can be temporary. Please try your search again. If the problem persists, try simplifying your topic or constraints.");
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

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra commentary, just provide the translation.\n\nText:\n"""\n${text}\n"""`;
    
    let lastError: Error | null = null;

    for (let i = 0; i < 3; i++) { // Retry up to 3 times
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            return response.text;
        } catch (error: any) {
            lastError = error;
            console.error(`Attempt ${i + 1} failed for translating text to ${targetLanguage}:`, error);
            
            const isRpcError = error instanceof Error && error.message.includes("Rpc failed due to xhr error");
            if (isRpcError) {
                // Exponential backoff
                const delayTime = 1000 * Math.pow(2, i);
                console.log(`Retrying translation in ${delayTime}ms...`);
                await delay(delayTime);
            } else {
                // Don't retry on other types of errors (e.g., bad request, auth error)
                break; 
            }
        }
    }

    console.error(`Error translating text to ${targetLanguage} after multiple retries:`, lastError);
    // Throw a more user-friendly error after all retries fail.
    throw new Error(`Failed to translate text. The translation service may be temporarily unavailable. Please try again later.`);
};
