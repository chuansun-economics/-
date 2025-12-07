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
        description: "The verbatim original Chinese text (原文) from the source. NO PARAPHRASING.",
      },
      source: {
        type: Type.STRING,
        description: "The exact official title of the article or poem (e.g., 《实践论》).",
      },
      year: {
        type: Type.STRING,
        description: "The historical year.",
      },
      explanation: {
        type: Type.STRING,
        description: "A brief interpretation in Chinese (Simplified).",
      },
    },
    required: ["content", "source", "explanation"],
  }
};

export const fetchQuoteBatch = async (): Promise<QuoteData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // Prompt updated to strictly require authoritative sources and original text
      contents: `请生成一个包含6条毛泽东语录的JSON数组。

严格要求 (Strict Requirements):
1. **内容必须是原文 (Verbatim Original Text)**: 必须严格摘录自《毛泽东选集》、《毛泽东文集》或《毛泽东诗词》的官方出版版本。绝对禁止篡改、缩略、断章取义或使用网络流传的概括性版本。
2. **出处必须准确 (Accurate Source)**: 必须提供准确的文章篇名或诗词名称（如《实践论》、《沁园春·雪》）。
3. **年份必须准确**: 对应文章发表或写作的历史年份。
4. **内容方向**: 选取关于唯物辩证法、战略思维、意志力与逆境成长的深刻语句。
5. **解析**: 用中文进行简练的现代解读。
6. **完整性**: 如果是名句，请尽量保留句子的完整结构，不要只截取半句。

JSON格式示例:
[
  {
    "content": "此处填写严格原文...",
    "source": "《文章篇名》",
    "year": "19xx",
    "explanation": "解析..."
  }
]`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteListSchema,
        temperature: 0.4, // Lower temperature to prioritize accuracy/verbatim recall over creativity
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