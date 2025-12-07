import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuoteData } from "../types";
import { getRandomStaticQuote } from "./staticQuotes";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for a LIST of quotes
const quoteListSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      content: {
        type: Type.STRING,
        description: "The quote content or fragment in Chinese (Simplified). Can be a short sentence, a philosophical phrase, or a poetic line.",
      },
      source: {
        type: Type.STRING,
        description: "The source title (e.g., 'On Practice', 'Poem name').",
      },
      year: {
        type: Type.STRING,
        description: "The year (approximate is fine).",
      },
      explanation: {
        type: Type.STRING,
        description: "A brief, one-sentence interpretation in Chinese (Simplified) related to resilience, strategy, or mindset. MUST BE IN CHINESE.",
      },
    },
    required: ["content", "source", "explanation"],
  }
};

export const fetchQuoteBatch = async (): Promise<QuoteData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // Updated prompt to ask for variety, fragments, and batching
      contents: "Generate a JSON array of 6 distinct, inspiring quotes or short sentence fragments from the Selected Works of Mao Zedong or his Poems. \n\nRequirements:\n1. Focus on short, punchy fragments about methodology, practice, or struggle.\n2. Include philosophical observations about contradictions and change.\n3. Avoid the most common quotes (e.g., 'Serve the People'). Try to find deeper, less cliché lines.\n4. The 'explanation' field MUST be in Chinese (Simplified).\n5. Output valid JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteListSchema,
        temperature: 1.2, // High temperature for variety
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini");
    }

    const data = JSON.parse(jsonText) as QuoteData[];
    return data;

  } catch (error) {
    console.warn("Error fetching quote batch, falling back to static:", error);
    // Return an empty array so the app knows to use static fallback
    return [];
  }
};

// Keep single fetch for backward compatibility or specific single updates if needed
export const fetchMaoQuote = async (): Promise<QuoteData> => {
    const batch = await fetchQuoteBatch();
    if (batch && batch.length > 0) {
        return batch[0];
    }
    return getRandomStaticQuote();
};