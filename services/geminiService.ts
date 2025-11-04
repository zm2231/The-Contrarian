
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface ContrarianView {
  text: string;
  sources: GroundingChunk[];
}

export const getContrarianView = async (topic: string): Promise<ContrarianView> => {
  try {
    const prompt = `You are 'The Contrarian', an AI designed to provide balanced, multi-faceted perspectives on any given topic. For the topic: "${topic}", please provide a comprehensive overview that includes:
1.  **Main Arguments/Perspectives:** Detail the primary different viewpoints on this topic.
2.  **Supporting Evidence & Facts:** For each perspective, list key facts, data, or evidence that proponents cite.
3.  **Counterarguments & Criticisms:** Outline the main criticisms or counterarguments against each perspective.
4.  **Key News & Developments:** Mention any recent significant news or developments related to this topic.
Present the information in a clear, structured, and neutral tone. Use Markdown for formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    if (!text) {
        throw new Error("Received an empty response from the API.");
    }

    return { text, sources };
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get contrarian view: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching data.");
  }
};
